import warnings

import requests
import re
import time

import six
from sseclient import SSEClient, Event, end_of_field


class CustomSSEClient(SSEClient):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __next__(self):
        while not self._event_complete():
            try:
                next_chunk = next(self.resp_iterator)
                if not next_chunk:
                    raise EOFError()
                self.buf += self.decoder.decode(next_chunk)

            except (StopIteration, requests.RequestException, EOFError, six.moves.http_client.IncompleteRead) as e:
                print(e)
                time.sleep(self.retry / 1000.0)
                self._connect()

                # The SSE spec only supports resuming from a whole message, so
                # if we have half a message we should throw it out.
                head, sep, tail = self.buf.rpartition('\n')
                self.buf = head + sep
                continue

        # Split the complete event (up to the end_of_field) into event_string,
        # and retain anything after the current complete event in self.buf
        # for next time.
        (event_string, self.buf) = re.split(end_of_field, self.buf, maxsplit=1)
        # event_string = event_string.replace('\n', '')
        msg = CustomEvent.parse(event_string)

        # If the server requests a specific retry delay, we need to honor it.
        if msg.retry:
            self.retry = msg.retry

        # last_id should only be set if included in the message.  It's not
        # forgotten if a message omits it.
        if msg.id:
            self.last_id = msg.id

        return msg


class CustomEvent(Event):
    sse_line_pattern = re.compile('(?P<name>[^:]*):?( ?(?P<value>.*))?')

    @classmethod
    def parse(cls, raw):
        """
        Given a possibly-multiline string representing an SSE message, parse it
        and return an Event object.
        """
        msg = cls()
        # print("raw : ", raw)
        raw = raw.replace('\r\n', '')
        # test = codecs.decode(raw, 'unicode_escape')
        # print("test:", test)
        for line in raw.splitlines():
            line = line.encode('latin1').decode('utf-8')
            # print("test : ", line)
            m = cls.sse_line_pattern.match(line)
            if m is None:
                # Malformed line.  Discard but warn.
                warnings.warn('Invalid SSE line: "%s"' % line, SyntaxWarning)
                continue

            name = m.group('name')
            if name == '':
                # line began with a ":", so is a comment.  Ignore
                continue
            value = m.group('value')

            if name == 'data':
                # If we already have some data, then join to it with a newline.
                # Else this is it.
                if msg.data:
                    msg.data = '%s\n%s' % (msg.data, value)
                else:
                    if '{' in value:
                        index = value.find('{')
                        msg.data = value[index:-1]
                    else:
                        msg.data = value[1:-1]

            elif name == 'event':
                msg.event = value
            elif name == 'id':
                msg.id = value
            elif name == 'retry':
                msg.retry = int(value)

        return msg
