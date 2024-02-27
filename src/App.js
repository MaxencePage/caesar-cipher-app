import React, { useState, useRef } from 'react';
import { useSpring } from 'react-spring';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import "./App.css";
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

function caesarEncrypt(data, key) {
  let res = "";
  for (let x = 0; x < data.length; x++) {
    if (data[x].match(/[A-Z]/)) {
      let pos = data[x].charCodeAt() - 65;
      pos = (pos + key) % 26;
      res += String.fromCharCode(pos + 65);
    } else if (data[x].match(/[a-z]/)) {
      let pos = data[x].charCodeAt() - 97;
      pos = (pos + key) % 26;
      res += String.fromCharCode(pos + 97);
    } else {
      res += data[x];
    }
  }
  return res;
}

function caesarDecrypt(data, key) {
  let res = "";
  for (let x = 0; x < data.length; x++) {
    if (data[x].match(/[A-Z]/)) {
      let pos = data[x].charCodeAt() - 65;
      pos = (pos - key + 26) % 26;
      res += String.fromCharCode(pos + 65);
    } else if (data[x].match(/[a-z]/)) {
      let pos = data[x].charCodeAt() - 97;
      pos = (pos - key + 26) % 26;
      res += String.fromCharCode(pos + 97);
    } else {
      res += data[x];
    }
  }
  return res;
}

function App() {
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [showKey, setShowKey] = useState(false);

  const messageInputRef = useRef(null);
  const keyInputRef = useRef(null);

  const preventScroll = (event) => {
    event.target.style.height = "30%"; // Adjust height as needed
  };  

  const fadeInSpring = useSpring({
    opacity: 1,
    from: { opacity: 0 },
  });

  const toggleKeyVisibility = () => {
    setShowKey(!showKey);
  };

  const encrypt = () => {
    if (!message || !key) {
      setError('Please enter both message and key.');
      setResult('');
      return;
    }
    const encryptedText = caesarEncrypt(message, parseInt(key));
    setResult(encryptedText);
    setError('');
  };

  const decrypt = () => {
    if (!message || !key) {
      setError('Please enter both message and key.');
      setResult('');
      return;
    }
    const decryptedText = caesarDecrypt(message, parseInt(key));
    setResult(decryptedText);
    setError('');
  };

  const clear = () => {
    setMessage('');
    setKey('');
    setResult('');
    setError('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const handlePaste = () => {
    navigator.clipboard.readText()
      .then((text) => {
        setMessage(text); // Update message state with pasted text
      })
      .catch((err) => {
        console.error("Error accessing clipboard:", err);
      });
  };
  
  return (
    <Container fluid>
      <Row className="vh-100 justify-content-center align-items-center">
        <Col xs={10} md={6} className="app-container" style={fadeInSpring}>
          <h1 className="text-center mb-4">Caesar Cipher App</h1>
          <Form className="mb-4">
            <Form.Group controlId="message">
              <Form.Label className="message-label">Message</Form.Label>
              <Form.Control
                as="textarea"
                value={message}
                onChange={  (e) => setMessage(e.target.value)}
                ref={messageInputRef}
                className="message-input"
                onInput={preventScroll} // Trigger on input change
              />
              <Button variant="secondary" onClick={handlePaste}>
              <span className="paste-icon"></span> Paste
              </Button>
            </Form.Group>
            <Form.Group controlId="key">
              <Form.Label className='key-label'>Key</Form.Label>
              <Form.Control
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                ref={keyInputRef}
                className="key-input"
              />
            </Form.Group>
            <Form.Group controlId="showKey">
              <Form.Check
                type="checkbox"
                label="Show Key"
                checked={showKey}
                onChange={toggleKeyVisibility}
                className="show-key-checkbox"
              />
            </Form.Group>
          </Form>
          <div className="button-container">
            <Button variant="primary" onClick={encrypt} className="me-2">
              <span className="encryption-icon"></span> Encrypt
            </Button>
            <Button variant="primary" onClick={decrypt} className="me-2">
              <span className="decryption-icon"></span> Decrypt
            </Button>
            <Button variant="secondary" onClick={clear} className="me-2">
              <span className="clear-icon"></span> Clear
            </Button>
            <Button variant="success" onClick={copyToClipboard}>
              <span className="copy-icon"></span> Copy to Clipboard
            </Button>
          </div>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          {result && <Alert variant="success" className="mt-3">Result: {result}</Alert>}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
