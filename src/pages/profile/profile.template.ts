export default `
        <aside class="profile-page__sidebar">
            <a href="/pages/chats/chats" class="profile-page__back-button">
                <span class="profile-page__back-icon"></span>
            </a>
        </aside>

        <main>
            <section class="profile-page__content">
                <div class="profile-page__header">
                    <button type="button" class="profile-page__avatar">
                        <span class="profile-page__avatar-text">Поменять<br>аватар</span>
                    </button>
                    <h1 class="profile-page__name">{{profile.name}}</h1>
                </div>

                <ul class="profile-page__settings-list">
                    {{#each profile.settings}}
                    <li class="profile-page__setting-item">
                        {{> input
                        type=type
                        name=name
                        label=label
                        value=value
                        readonly=readonly
                        }}
                    </li>
                    {{/each}}
                </ul>

                <div class="profile-page__actions">
                    <button type="button" class="profile-page__action-button">Изменить данные</button>
                    <button type="button" class="profile-page__action-button">Изменить пароль</button>
                    <button type="button"
                        class="profile-page__action-button profile-page__action-button--danger">Выйти</button>
                </div>
            </section>
        </main>
    `;


