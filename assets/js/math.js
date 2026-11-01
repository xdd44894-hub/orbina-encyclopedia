// Keep TeX fences intact in the source and turn only explicit math into equations.
window.MathJax = {
  tex: {
    inlineMath: [['\\(', '\\)']],
    displayMath: [['\\[', '\\]'], ['$$', '$$']],
    packages: ['base', 'ams', 'newcommand', 'noundefined']
  },
  svg: { fontCache: 'local' },
  options: { enableMenu: false },
  startup: {
    ready: function () {
      var body = document.querySelector('.article-body');
      if (body) {
        body.querySelectorAll('pre code').forEach(function (code) {
          var pre = code.closest('pre');
          var wrapper = pre.closest('.highlighter-rouge');
          var language = wrapper || code;
          if (!['language-tex', 'language-latex', 'language-math'].some(function (name) {
            return language.classList.contains(name) || code.classList.contains(name);
          })) return;
          var equation = document.createElement('div');
          equation.className = 'math-display';
          equation.textContent = '\\[' + code.textContent.trim() + '\\]';
          (wrapper || pre).replaceWith(equation);
        });
        // Kramdown emits these for $$ math; MathJax 3 uses text delimiters.
        body.querySelectorAll('script[type^="math/tex"]').forEach(function (source) {
          var display = source.type.indexOf('mode=display') !== -1;
          var equation = document.createElement(display ? 'div' : 'span');
          equation.className = display ? 'math-display' : 'math-inline';
          equation.textContent = (display ? '\\[' : '\\(') + source.textContent + (display ? '\\]' : '\\)');
          source.replaceWith(equation);
        });
      }
      MathJax.startup.defaultReady();
    }
  }
};
