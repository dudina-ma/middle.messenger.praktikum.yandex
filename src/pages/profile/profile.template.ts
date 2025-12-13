export default `
        <aside class="profile-page__sidebar">
            {{{chatsBackLink}}}
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
                        {{{profileLogoutButton}}}
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


