'use client';
import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    let response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    let data = await response.json();
  };

  return (
    <div className="flex flex-1 flex-col gap-3 justify-center items-center bg-slate-500">
      <input
        type="text"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setEmail(e.target.value);
        }}
      />
      <input
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setPassword(e.target.value);
        }}
      />

      <button
        onClick={() => {
          handleSubmit();
        }}
      >
        login
      </button>
    </div>
  );
};

export default Login;
