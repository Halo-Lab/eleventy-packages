module.exports = class {
  data() {
    return {
      lang: 'en',
      title: 'Home Page',
      layout: 'base',
      styles: 'index.scss',
      scripts: 'index.js',
      keywords: '',
      permalink: 'index.html',
      description: '',
    };
  }

  render() {
    return /* html */ `<p>Hello world.</p>`;
  }
};
