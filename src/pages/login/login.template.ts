export default `
        <section class="login-form-container">
            <form class="login-form">
                <h1 class="login-form__title">Вход</h1>

                {{{loginInput}}}
                {{{passwordInput}}}

                <button type="submit" class="login-form__button">Войти</button>

                <a href="/pages/signup/signup" class="login-form__link">Создать аккаунт</a>
            </form>
        </section>
    `;

