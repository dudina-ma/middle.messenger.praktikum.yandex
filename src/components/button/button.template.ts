export default `
    {{#if icon}}
      <span class="{{iconClass}}"></span>
    {{/if}}
    {{#if text}}
      {{text}}
    {{/if}}
    {{#if content}}
      <span class="{{contentClass}}">{{content}}</span>
    {{/if}}
`;
