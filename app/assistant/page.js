'use client';

import "../globals.css"
import { useState, useEffect } from "react";
import { Textarea } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/button";
import { IoIosSend } from "react-icons/io";
import { Input } from "@nextui-org/input";
import { PiChalkboardTeacher } from "react-icons/pi";
import { IoPersonAddSharp } from "react-icons/io5";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Checkbox, Link } from "@nextui-org/react";
import ReactMarkdown from 'react-markdown';

export default function Assistant() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hello! How may I assist you today? If you have any questions about your courses, professors, or anything else, feel free to ask!"
        },
    ]);

    const [message, setMessage] = useState("");
    const [professorUrl, setProfessorUrl] = useState("");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [chartData, setChartData] = useState(null);

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
            });
        });
    };

    const submitProfessor = async () => {
        const response = await fetch("/api/professor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: professorUrl }),
        });

        if (!response.ok) {
            console.error("Error submitting professor: ", response.statusText);
            return;
        }

        const data = await response.json();
        console.log(data);
        setProfessorUrl("");
    }

    return (
        <div className="w-full bg-cover bg-center assistant-page h-screen flex flex-col justify-center">
            <div className="max-w-[390px] md:max-w-6xl mt-2 bg-amethyst-50 h-5/6 flex flex-col p-4 border-none rounded-xl border-amethyst-400 shadow-3xl mb-2">
                <h1 className="text-center text-xl md:text-2xl text-amethyst-500 mb-2">ProfSelector Assistant Chat</h1>

                {/* Messages Container */}
                <div className="flex-1 gap-2 p-2 overflow-auto custom-scrollbar">
                    {messages.map((message, index) => {
                        return (
                            <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                                <div className={`flex-col flex rounded-xl text-white p-3 mb-2 ${message.role === "assistant" ? "bg-amethyst-500" : "bg-amethyst-400"}`}>
                                    <ReactMarkdown className="prose">{message.content}</ReactMarkdown>
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
                    <div className="flex flex-col gap-2">
                        <Button className="font-bold transition ease-in-out hover:scale-105 duration-300 delay-50 bg-amethyst-500 text-white ml-2 hover:shadow-md" onPress={sendMessage} endContent={<IoIosSend className="w-5 h-5" />}>Send</Button>
                        <Button className="font-bold transition ease-in-out hover:scale-105 duration-300 delay-50 bg-amethyst-500 text-white ml-2 hover:shadow-md" onPress={onOpen} endContent={<IoPersonAddSharp className="w-5 h-5" />}>Add</Button>
                    </div>
                    <Modal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        placement="center"
                        className="bg-amethyst-50 shadow-xl"
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="justify-center text-amethyst-950 items-center flex flex-col gap-1">Import Professor Profile</ModalHeader>
                                    <ModalBody>
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
                                    </ModalBody>
                                    <ModalFooter className="justify-center items-center text-center">
                                        <Button className="font-bold transition ease-in-out hover:scale-105 duration-300 delay-50 bg-amethyst-500 text-white ml-2 hover:shadow-md" onPress={submitProfessor} endContent={<PiChalkboardTeacher className="w-6 h-6" />}>Submit</Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </div>
        </div>
    );
}