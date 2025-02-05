"use client";
import React, { ChangeEventHandler } from "react";

interface InputProps {
  id: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: string;
  label: string;
  type?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  onChange,
  value,
  label,
  type = "text",
}) => {
  return (
    <div className="relative bg-transparent backdrop-blur-xl">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=""
        className="block rounded-md bg-neutral-400/10 bg-clip-padding backdrop-filter border backdrop-blur-xl px-6 pt-6 w-full text-base border-gray-50/20 hover:border-gray-50/30 appearance-none focus:ring-0 peer"
      />
      <label
        className="absolute text-base text-zinc-400 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
