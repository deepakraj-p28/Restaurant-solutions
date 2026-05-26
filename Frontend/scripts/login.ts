export type LoginField = {
  id: string;
  name: "identifier" | "password";
  label: string;
  type: "text" | "password";
  autoComplete: string;
  placeholder: string;
  required: boolean;
};

export type LoginPayload = {
  identifier: string;
  password: string;
  remember: boolean;
};

export const loginFields: LoginField[] = [
  {
    id: "identifier",
    name: "identifier",
    label: "Email or username",
    type: "text",
    autoComplete: "username",
    placeholder: "you@boccacafe.com",
    required: true,
  },
  {
    id: "password",
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "current-password",
    placeholder: "Enter your password",
    required: true,
  },
];

export const rememberField = {
  id: "remember",
  name: "remember",
  label: "Remember me",
} as const;

export function buildLoginPayload(form: HTMLFormElement): LoginPayload {
  const data = new FormData(form);

  return {
    identifier: String(data.get("identifier") ?? "").trim(),
    password: String(data.get("password") ?? ""),
    remember: data.get("remember") === "on",
  };
}
