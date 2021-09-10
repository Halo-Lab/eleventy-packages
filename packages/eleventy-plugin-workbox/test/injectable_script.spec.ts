import { buildSWScriptRegistration } from '../src/injectable_script';

describe('buildSWScriptRegistration', () => {
  it('should return script tag, which injects service worker to page', () => {
    const publicUrl = 'foo/sw.js';
    const scope = '/';
    const script = buildSWScriptRegistration(publicUrl, scope);

    expect(script).toMatch(/<script>/);
    expect(script).toMatch(/\/foo\/sw\.js/);
  });

  it('should define scope for service worker', () => {
    const publicUrl = 'foo/sw.js';
    const scope = 'baz';
    const script = buildSWScriptRegistration(publicUrl, scope);

    expect(script).toMatch(/{\s*scope:\s*"baz"\s*}/);
  });
});
