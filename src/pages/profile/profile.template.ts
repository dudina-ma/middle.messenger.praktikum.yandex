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

                {{#if isViewData}}
                    {{{profileViewForm}}}

                    <div class="profile-page__actions">
                        {{{profileChangeDataButton}}}
                        {{{profileChangePasswordButton}}}
                        <button type="button"
                            class="profile-page__action-button profile-page__action-button--danger">Выйти</button>
                    </div>
                {{/if}}

                {{#if isEditData}}
                    {{{profileEditForm}}}
                {{/if}}

                {{#if isPasswordChange}}
                    {{{profilePasswordChangeForm}}}
                {{/if}}
            </section>
        </main>
    `;


