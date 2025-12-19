export default `
        <aside class="profile-page__sidebar">
            {{{chatsBackLink}}}
        </aside>

        <main>
            {{{changeAvatarModal}}}

            <section class="profile-page__content">
                <div class="profile-page__header">
                    {{{changeAvatarButton}}}
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


