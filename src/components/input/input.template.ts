export default `
  {{#if label}}
    <label for="{{name}}" class="input-field__label">{{label}}</label>
  {{/if}}

  {{#if icon}}
    <span class="{{iconClass}}"></span>
  {{/if}}
  
  <input 
    type="{{type}}" 
    id="{{name}}"
    name="{{name}}" 
    class="{{class}}"
    {{#if placeholder}}placeholder="{{placeholder}}"{{/if}}
    {{#if value}}value="{{value}}"{{/if}}
    {{#if readonly}}readonly{{/if}}
    {{#if required}}required{{/if}}
  >
  
  {{#if error}}
    <div class="input-field__error">{{errorText}}</div>
  {{/if}}
`;
