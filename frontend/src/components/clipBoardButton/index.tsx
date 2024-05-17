import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton, TextField } from '@mui/material';
import React, { useState } from 'react';

import * as S from '@/components/clipBoardButton/indexStyle';

const ClipboardButton: React.FC = () => {
  const [textToCopy, setTextToCopy] = useState('');
  const [pastedText, setPastedText] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextToCopy(event.target.value);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      alert('Text copied to clipboard!');
    } catch (err) {
      alert('Failed to copy text to clipboard');
      console.error('Failed to copy text: ', err);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const clipboardText = event.clipboardData.getData('text');
    setPastedText(clipboardText);
  };

  return (
    <S.LayOut>
      <S.ButtonLayOut>
        <TextField
          label="Enter text to copy"
          variant="outlined"
          value={textToCopy}
          onChange={handleChange}
        />
        <IconButton onClick={copyToClipboard} aria-label="copy to clipboard">
          <ContentCopyIcon />
        </IconButton>
      </S.ButtonLayOut>
      <TextField
        label="Paste text here"
        variant="outlined"
        value={pastedText}
        onPaste={handlePaste}
      />
    </S.LayOut>
  );
};

export default ClipboardButton;
