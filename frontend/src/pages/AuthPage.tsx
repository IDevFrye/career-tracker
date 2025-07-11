import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa, VIEWS } from "@supabase/auth-ui-shared";
import { supabase } from "../supabaseClient";
import ThemeToggle from "../components/ThemeToggle";
import "./AuthPage.scss";
import { useLocation } from "react-router-dom";

const errorTranslations: Record<string, string> = {
  "To signup, please provide your email":
    "Пожалуйста, введите email для регистрации",
  "Signup requires a valid password": "Введите корректный пароль",
  "User already registered": "Пользователь уже зарегистрирован",
  "Only an email address or phone number should be provided on signup.":
    "Укажите только email или телефон",
  "Signups not allowed for this instance": "Регистрация запрещена",
  "Email signups are disabled": "Регистрация по email отключена",
  "Email link is invalid or has expired": "Ссылка недействительна или устарела",
  "Token has expired or is invalid": "Токен устарел или недействителен",
  "The new email address provided is invalid": "Неверный email",
  "Password should be at least 6 characters.":
    "Пароль должен быть не менее 6 символов",
  "Invalid login credentials": "Неверный email или пароль",
};

const useSupabaseAuthErrorLocalization = () => {
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type !== "childList" || mutation.addedNodes.length === 0)
          return;
        for (const node of mutation.addedNodes) {
          if (
            node instanceof HTMLElement &&
            (node.classList.contains("supabase-account-ui_ui-message") ||
              node.classList.contains("supabase-auth-ui_ui-message"))
          ) {
            const originErrorMessage = node.innerHTML.trim();
            const translatedErrorMessage =
              errorTranslations[originErrorMessage] || originErrorMessage;
            if (!document.querySelector("#auth-forgot-password")) {
              node.innerHTML = translatedErrorMessage;
            }
          }
        }
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, []);
};

const AuthPage: React.FC = () => {
  useSupabaseAuthErrorLocalization();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");

    if (type === "recovery") {
      console.log("Recovery detected, signing out...");
      supabase.auth.signOut();
    }
  }, [location]);

  const params = new URLSearchParams(location.search);
  const type = params.get("type");
  const accessToken = params.get("access_token");
  const isRecovery =
    type === "recovery" || (accessToken && type === "recovery");

  return (
    <div className="auth-page">
      <header className="auth-page__header">
        <span className="auth-page__logo" />
        <ThemeToggle />
      </header>
      <div className="auth-page__content">
        <Auth
          redirectTo={process.env.VITEREACT_CLIENT_URL}
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google", "github"]}
          view={isRecovery ? VIEWS.UPDATE_PASSWORD : undefined}
          showLinks={true}
          onlyThirdPartyProviders={false}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                email_input_placeholder: "Введите вашу электронную почту",
                password_label: "Пароль",
                password_input_placeholder: "Введите ваш пароль",
                button_label: "Войти",
                loading_button_label: "Вход...",
                social_provider_text: "Войти с помощью {{provider}}",
                link_text: "Уже есть аккаунт? Войти ",
              },
              sign_up: {
                email_label: "Email",
                email_input_placeholder: "Введите вашу электронную почту",
                password_label: "Пароль",
                password_input_placeholder: "Введите ваш пароль",
                button_label: "Зарегистрироваться",
                loading_button_label: "Регистрация...",
                link_text: "Нет аккаунта? Зарегистрироваться",
                confirmation_text: "Проверьте вашу электронную почту",
                social_provider_text:
                  "Зарегестрироваться с помощью {{provider}}",
              },
              forgotten_password: {
                email_label: "Email",
                password_label: "Пароль",
                link_text: "Забыли пароль?",
                confirmation_text:
                  "Проверьте вашу электронную почту для получения ссылки на сброс пароля",
                email_input_placeholder: "Введите вашу электронную почту",
                button_label: "Отправить ссылку",
                loading_button_label: "Отправка...",
              },
              update_password: {
                password_label: "Пароль",
                password_input_placeholder: "Введите ваш новый пароль",
                button_label: "Обновить пароль",
                loading_button_label: "Обновление...",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AuthPage;
