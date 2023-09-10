import React, { useCallback, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javaLanguage } from '@codemirror/lang-java';
import { pythonLanguage } from '@codemirror/lang-python';

function Editor(params) {
  const [lang, setLang] = useState('javaLanguage');
  const onChange = useCallback((value, viewUpdate) => {
    console.log('value:', value);
  }, []);
  return (
    <CodeMirror
      value="console.log('hello world!');"
      height="200px"
      extensions={[javaLanguage]}
      onChange={onChange}
    />
  );
}

export default Editor;