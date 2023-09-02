import { json, redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export const authenticationAction = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;

  const mode = searchParams.get("mode") || "signup";

  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "This mode is not supported" }, { status: 422 });
  }

  const data = await request.formData();

  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  
  const response = await fetch("http://localhost:8080/" + mode, {
    method: "POST",
    body: JSON.stringify(authData),
    headers: {
      "content-type": "application/json",
    },
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }
  if (!response.ok) {
    throw json({ message: "Could Not Save The Data" }, { status: 500 });
  }

  const resData = await response.json();
  const token = resData.token;

  localStorage.setItem("token", token);

  return redirect("/");
};
