'use client';

import "./globals.css"
import { useState, useEffect } from "react";
import { Textarea } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/button";
import { IoIosSend } from "react-icons/io";
import { Input } from "@nextui-org/input";
import { PiChalkboardTeacher } from "react-icons/pi";

import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm the Rate My Professor support assistant. How can I help you today?"
    },
  ]);

  const [message, setMessage] = useState("");
  const [professorUrl, setProfessorUrl] = useState("");

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ])

    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true });

        console.log("Raw output: ", text);

        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        });

        return reader.read().then(processText);
      })
    });
  };

  const submitProfessor = async () => {
    const response = fetch("/api/professor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: professorUrl }),
    });

    const data = await response.json();
    console.log(data);
    setProfessorUrl("");
  }

  return (
    <div className="w-full bg-amethyst-200 h-screen flex justify-center">
      <div className="max-w-2xl mt-6 bg-amethyst-100 h-[950px] flex flex-col p-4 border-2 rounded-lg border-amethyst-400 shadow-md">

        {/* Messages Container */}
        <div className="flex-1 gap-2 p-2 overflow-auto custom-scrollbar">
          {messages.map((message, index) => {
            return (
              <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                <div className={`flex-col flex rounded-xl text-white p-3 mb-2 ${message.role === "assistant" ? "bg-amethyst-500" : "bg-amethyst-400"}`}>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Container */}
        <div className="w-full flex items-center justify-center p-2 mb-2">
          <Textarea
            classNames={{
              base: "flex-1",
              input: "text-black",
              label: "bg-amethyst-100 !text-amethyst-400 font-bold rounded-xl p-1 border-2 border-amethyst-400",
              inputWrapper: "border-2 !border-amethyst-500 hover:border-sky-500 focus:border-sky-500 shadow-none hover:shadow-md",
            }}
            css={{
              "&:focus": {
                borderColor: "#863de0",
              },
            }}
            variant="bordered"
            placeholder="Search for a professor..."
            value={message}
            label="Message"
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button className="font-bold transition ease-in-out hover:scale-105 duration-300 delay-50 bg-amethyst-500 text-white ml-2 hover:shadow-md" onClick={sendMessage} endContent={<IoIosSend className="w-5 h-5" />}>Send</Button>
        </div>
        <hr className="border-2 border-dashed border-amethyst-500" />
        {/* Professor URL Input */}
        <div className="w-full flex flex-col items-center justify-center p-2 mt-2">
          <p className="mb-2 text-amethyst-950 font-semibold">Submit a link to a RateMyProfessor profile</p>
          <Input
            classNames={{
              base: "flex-1",
              input: "text-black",
              label: "!text-amethyst-400 font-bold",
              inputWrapper: "border-2 !border-amethyst-500 shadow-none hover:shadow-md",
              innerWrapper: "focus:border-sky-500",
            }}
            variant="bordered"
            label="Professor URL"
            type="url"
            value={professorUrl}
            onChange={(e) => setProfessorUrl(e.target.value)}
          />
          <Button className="mt-2 font-bold transition ease-in-out hover:scale-105 duration-300 delay-50 bg-amethyst-500 text-white ml-2 hover:shadow-md" onClick={submitProfessor} endContent={<PiChalkboardTeacher className="w-6 h-6" />}>Submit</Button>
        </div>
      </div>
    </div>
  );

}