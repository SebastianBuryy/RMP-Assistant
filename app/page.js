'use client';

import * as React from "react";
import "./globals.css";
import { PiStudentBold } from "react-icons/pi";
import { FaSearch } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { RiRobot3Line } from "react-icons/ri";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import Tilt from "react-parallax-tilt";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-cover bg-center landing-page">
      <nav className="w-full backdrop-blur-[400px] p-5 shadow-xl mb-20">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <div className="flex justify-start items-center">
            <PiStudentBold className="text-amethyst-400 w-8 h-8 mr-2" />
            <p className="text-amethyst-50 w-32 font-semibold">ProfSelector AI</p>
          </div>
          <div className="w-full flex justify-end mr-2">
            <Link href="/assistant">
              <Button className="font-bold transition ease-in-out hover:scale-105 duration-300 delay-50 bg-amethyst-50 text-amethyst-900 ml-2 hover:shadow-xl">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="w-full flex justify-center items-center mt-20 mb-10">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4">
            <h1 className="text-amethyst-400 text-5xl md:text-7xl [text-shadow:_0_0px_10px_rgb(153_88_238_/_80%)] text-center font-bold mb-2">ProfSelector AI</h1>
            <h1 className="text-amethyst-200 text-3xl md:text-5xl [text-shadow:_0_0px_10px_rgb(153_108_238_/_80%)] text-center font-semibold mb-4">Find the perfect professor with AI-driven insights.</h1>
            <p className="text-amethyst-50 text-lg md:text-xl [text-shadow:_0_0px_8px_rgb(153_138_220_/_80%)] text-center ">Powered by RateMyProfessor, our assistant helps you discover the right <br /> professors based on your preferences.</p>
          </div>
          <div className="flex flex-col items-center">
            <Link href="/assistant">
              <Button size="lg" className="font-bold transition ease-in-out hover:scale-105 duration-300 delay-50 bg-amethyst-500 text-white ml-2 hover:shadow-md">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center mb-10">
        <Image src="/images/professor.svg" height={900} width={900} alt="Professor" />
      </div>

      {/*Features Section*/}
      <div className="w-full flex justify-center items-center mb-20">

        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-3xl text-amethyst-100 [text-shadow:_0_0px_10px_rgb(153_88_238_/_80%)] font-bold sm:text-4xl">Features</h2>
            <hr className="w-20 h-1 bg-amethyst-400 mx-auto mt-2 mb-8 border-none" />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Tilt>
              <a
                className="block bg-amethyst-800/50 backdrop-blur-[500px] rounded-xl border-amethyst-300 p-8 shadow-2xl transition ease-in-out delay-50 duration-300 hover:shadow-lg"
              >
                <RiRobot3Line className="w-9 h-9 text-amethyst-400" />

                <h2 className="mt-4 text-xl font-bold text-amethyst-50">Custom Recommendations</h2>

                <p className="mt-1 text-sm text-amethyst-200">
                  Get personalised professor matches based on real student reviews.
                </p>
              </a>
            </Tilt>
            <Tilt>
              <a
                className="block bg-amethyst-800/50 backdrop-blur-[500px] rounded-xl border-amethyst-300 p-8 shadow-2xl transition ease-in-out delay-50 duration-300 hover:shadow-lg"
              >
                <GoGraph className="w-9 h-9 text-amethyst-400" />

                <h2 className="mt-4 text-xl font-bold text-amethyst-50">Comprehensive Data</h2>

                <p className="mt-1 text-sm text-amethyst-200">
                  Access detailed professor profiles with ratings, reviews, courses and more.
                </p>
              </a>
            </Tilt>
            <Tilt>
              <a
                className="block bg-amethyst-800/50 backdrop-blur-[500px] rounded-xl border-amethyst-300 p-8 shadow-2xl transition ease-in-out delay-50 duration-300 hover:shadow-lg"
              >
                <FaSearch className="w-8 h-8 text-amethyst-400" />

                <h2 className="mt-4 text-xl font-bold text-amethyst-50">Easy Search</h2>

                <p className="mt-1 text-sm text-amethyst-200">
                  Find professors by name, department, teaching style, and more.
                </p>
              </a>
            </Tilt>
          </div>
        </div>
      </div>

      {/*Footer Section*/}
      <div>
        <footer>
          <div className="w-full bg-transparent backdrop-blur-[400px] p-6 flex justify-center items-center shadow-xl">
            <p className="text-amethyst-200 text-center transition">&copy; 2024 - Built by&nbsp;
              <a href="https://github.com/sebastianburyy" rel="noreferrer" target="_blank" className="text-amethyst-50 font-semibold relative after:bg-amethyst-50 after:absolute after:h-0.5 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer">Sebastian Bury</a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}