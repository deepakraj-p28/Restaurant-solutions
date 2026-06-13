"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { buildLoginPayload, loginFields, rememberField } from "@/scripts/login";

type LoginCardProps = {
  onLoginSuccess?: () => void;
};

export default function LoginCard({ onLoginSuccess }: LoginCardProps = {}) {
  const router = useRouter();
  const [status, setStatus] = useState<string>("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = buildLoginPayload(event.currentTarget);

    if (payload.identifier === "admin" && payload.password === "password") {
      setStatus("");
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        router.push("/home");
      }
      return;
    }

    setStatus("Invalid username or password.");
  }

  return (
    <div className="login-card w-full max-w-[460px] rounded-[28px] border border-[rgba(70,54,43,0.14)] bg-[rgba(255,252,247,0.88)] p-7 text-left shadow-login-card backdrop-blur-2xl sm:p-9">
      <h1 id="login-title" className="text-[clamp(2rem,4vw,2.75rem)] font-bold leading-[1.04] tracking-[-0.04em] text-[#1f1a17]">
        Welcome.
      </h1>
      <p className="mt-3.5 text-base leading-relaxed text-[#6f6257]">
        Sign in to manage stock, track orders, and keep the cafe moving smoothly.
      </p>

      <form className="mt-7" aria-labelledby="login-title" onSubmit={handleSubmit}>
        {loginFields.map((field) => (
          <div className="mb-4" key={field.id}>
            <label className="mb-2 inline-block text-[0.92rem] font-semibold text-[#342c27]" htmlFor={field.id}>
              {field.label}
            </label>
            <input
              className="login-input"
              id={field.id}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
        ))}

        <div className="mb-6 mt-1.5 flex items-center justify-between gap-3 text-[0.92rem] max-sm:flex-col max-sm:items-start">
          <label className="inline-flex items-center gap-2.5 text-[#6f6257]" htmlFor={rememberField.id}>
            <input
              className="h-[18px] w-[18px] accent-[#1f1a17]"
              id={rememberField.id}
              name={rememberField.name}
              type="checkbox"
            />
            {rememberField.label}
          </label>
          <a className="forgot-link rounded-lg text-[#4d4035]" href="#">
            Forgot password?
          </a>
        </div>

        <button className="login-button" type="submit">
          Log in
        </button>

        {status ? (
          <p className="mt-4 text-sm font-semibold text-[#8f2f1f]" role="status" aria-live="polite">
            {status}
          </p>
        ) : null}
      </form>
    </div>
  );
}
