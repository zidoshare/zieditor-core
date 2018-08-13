import * as Remarkable from 'remarkable';
import { addClass, hasClass, removeClass } from './utils/className';
import select from './utils/select';
declare var window: Window & { hljs: any }
let mdHtml: Remarkable, mdSrc: Remarkable, permallink, scrollMap;
let defaults = {
  html: false,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  linkify: true,
  linkTarget: '',
  typographer: true,

  _highlight: true,
  _strict: false,
  _view: 'html',
  hightlight: function (str: string, lang: string) {
    if (!defaults._highlight || !window.hljs) {
      return '';
    }
    if (lang && window.hljs.getLanguage(lang)) {
      try {
        return window.hljs.highlight(lang, str).value
      } catch (__) { }
    }
    try {
      return window.hljs.highlightAuto(str).value
    } catch (__) { }
    return ''
  }
}

function setOptionClass(name: string, val: string) {
  if (val) {
    addClass(document.body, `opt_${name}`);
  } else {
    removeClass(document.body, `opt_${name}`)
  }
}

function setResultView(val: string) {
  removeClass(document.body, 'result-as-html');
  removeClass(document.body, 'result-as-src');
  removeClass(document.body, 'result-as-debug');
  addClass(document.body, 'result-as-' + val)
  defaults._view = val;
}
function mdInit() {
  if (defaults._strict) {
    mdHtml = new Remarkable('commonmark');
    mdSrc = new Remarkable('commonmark');
  } else {
    mdHtml = new Remarkable('full', defaults);
    mdSrc = new Remarkable('full', defaults);
  }
  mdHtml.renderer.rules.table_open = function () {
    return '<table class="table table-striped">\n';
  };
  mdHtml.renderer.rules.paragraph_open = function (tokens: Remarkable.Token[], idx: number): string {
    let line: number;
    const lines = tokens[idx].lines;
    if (lines && tokens[idx].level === 0) {
      line = lines[0];
      return `<p class="line" data-line="${line}">`;
    }
    return '<p>';
  };

  mdHtml.renderer.rules.heading_open = function (tokens: Remarkable.Token[], idx: number): string {
    let line;
    const lines = tokens[idx].lines;
    if (lines && tokens[idx].level === 0) {
      line = lines[0]
      return `<h${tokens[idx].hLevel} class="line" data-line="${line}"`;
    }
    return `<h${tokens[idx].hLevel}>`;
  };
}

function setHighlightedContent(selector: string, content: string, lang: string) {
  if (window.hljs) {
    select(selector).html(window.hljs.highlight(lang, content).value);
  } else {
    select(selector).text(content);
  }
}

function updateResult() {
  let source = select('.source').val();
  if (defaults._view === 'src') {
    setHighlightedContent('.result-src-content', mdSrc.render(source), 'html');
  } else if (defaults._view === 'debug') {
    setHighlightedContent('.result-debug-content',
      JSON.stringify(mdSrc.parse(source, { references: {} }), null, 2),
      'json'
    );
  } else {
    select('.result-html').html(mdHtml.render(source));
  }
  scrollMap == null;
  try {
    if (source) {
      permallink.href = '#md64=' + window.btoa(encodeURI(JSON.stringify({
        source,
        defaults: {
          ...defaults,
          highlight: null,
        }
      })))
    } else {
      permallink.href = '';
    }
  } catch (__) {
    permallink.href = '';
  }
}

function buildScrollMap() {
  let i, offset, nonEmptyList, pos, a, b, lineHeightMap, linesCount,
    acc, textarea = select('.source'),
    _scrollMap;
  let sourceLikeDiv = document.createElement('div');
  
}
if (module.hot) {
  module.hot.accept()
}
