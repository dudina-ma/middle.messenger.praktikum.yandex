export default `
        <section class="signup-form-container">
            <form class="signup-form">
                <h1 class="signup-form__title">Регистрация</h1>

                {{{emailInput}}}
                {{{loginInput}}}
                {{{firstNameInput}}}
                {{{secondNameInput}}}
                {{{phoneInput}}}
                {{{passwordInput}}}
                {{{passwordRepeatedInput}}}

                <button type="submit" class="signup-form__button">Зарегистрироваться</button>

                <a href="/pages/login/login" class="signup-form__link">Войти</a>
            </form>
        </section>
    `;


