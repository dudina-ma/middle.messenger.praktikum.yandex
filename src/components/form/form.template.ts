export default `
    {{#if title}}
      <h1 class="{{titleClass}}">{{title}}</h1>
    {{/if}}

    {{#if formChildren}}
      {{#each formChildren}}
        {{{this}}}
      {{/each}}
    {{/if}}
`;
