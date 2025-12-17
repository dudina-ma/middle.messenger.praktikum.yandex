export default `
<div class="modal__content">
    {{#if title}}
      <h1 class="modal__title">{{title}}</h1>
    {{/if}}

    {{#if modalChildren}}
      {{#each modalChildren}}
        {{{this}}}
      {{/each}}
    {{/if}}
</div>`;
