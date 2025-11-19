export default `
        <section class="login-form-container">
            <form class="login-form">
                <h1 class="login-form__title">Вход</h1>

                {{> input
                type="text"
                name="login"
                label="Логин"
                placeholder="Логин"
                error="true"
                errorText="Неверный логин"
                }}

                {{> input
                type="password"
                name="password"
                label="Пароль"
                placeholder="Пароль"
                }}

                <button type="submit" class="login-form__button">Войти</button>

                <a href="/pages/signup/signup" class="login-form__link">Создать аккаунт</a>
            </form>
        </section>
    `;

