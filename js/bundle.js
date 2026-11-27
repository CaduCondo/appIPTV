/* @ds-bundle: {"format":4,"namespace":"CinemaLivre","components":[{"name":"Icon"},{"name":"RatingBadge"},{"name":"PosterCard"},{"name":"CategoryMenu"},{"name":"MetaChips"},{"name":"CastAvatar"},{"name":"SeasonTabs"},{"name":"EpisodeCard"},{"name":"ActionButton"},{"name":"Field"},{"name":"ProfileItem"},{"name":"HubTile"},{"name":"DigitField"},{"name":"NumericKeypad"}]} */
(function () {
  var h = React.createElement;

  function cx() {
    return Array.prototype.filter.call(arguments, Boolean).join(' ');
  }
  function pad(n) {
    n = String(n);
    return n.length < 2 ? '0' + n : n;
  }
  function hue(s) {
    var n = 0;
    s = s || '';
    for (var i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0;
    return n % 4;
  }
  function initials(s) {
    var p = String(s || '').split(' ').filter(Boolean);
    return ((p[0] || '').charAt(0) + (p.length > 1 ? p[p.length - 1].charAt(0) : '')).toUpperCase();
  }

  var PATHS = {
    star: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z',
    heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
    home: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z',
    back: 'M15 5l-7 7 7 7',
    speaker: 'M4 9v6h4l5 4V5L8 9H4z M16 9a4 4 0 0 1 0 6 M18.5 6.5a8 8 0 0 1 0 11',
    play: 'M7 4l13 8-13 8z',
    search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-4-4',
    related: 'M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z',
    plus: 'M12 5v14 M5 12h14',
    check: 'M5 12l5 5 9-10',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',
    live: 'M12 12v.01 M8.5 8.5a5 5 0 0 0 0 7 M15.5 8.5a5 5 0 0 1 0 7 M5.5 5.5a9 9 0 0 0 0 13 M18.5 5.5a9 9 0 0 1 0 13',
    film: 'M4 4h16v16H4z M8 4v16 M16 4v16 M4 9h4 M4 15h4 M16 9h4 M16 15h4',
    series: 'M4 7h16v13H4z M9 3l3 4 3-4',
    settings: 'M4 6h10 M18 6h2 M4 12h4 M12 12h8 M4 18h12 M20 18h0 M14 4v4 M8 10v4 M16 16v4',
    refresh: 'M20 12a8 8 0 1 1-2.5-5.8 M20 4v5h-5',
    history: 'M12 7v5l3 2 M4 12a8 8 0 1 0 2.3-5.7 M4 4v4h4',
    logout: 'M10 4H5v16h5 M15 8l4 4-4 4 M19 12H9',
    pause: 'M8 5v14 M16 5v14',
    backspace: 'M21 5H9l-6 7 6 7h12z M14 9l4 6 M18 9l-4 6'
  };

  /* Icon: 24px grid, 2px stroke, currentColor. */
  function Icon(props) {
    var size = props.size || 20;
    return h(
      'svg',
      {
        className: cx('cl-icon', props.className),
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: props.fill ? 'currentColor' : 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true'
      },
      h('path', { d: PATHS[props.name] || PATHS.star })
    );
  }

  /* Image or, while there is none (or it fails to load), a neutral placeholder. */
  function Art(props) {
    var st = React.useState(false);
    if (props.src && !st[0]) {
      return h('img', {
        className: cx('cl-art', props.fit === 'contain' && 'cl-art--contain'),
        src: props.src,
        alt: props.alt || '',
        loading: 'lazy',
        onError: function () { st[1](true); }
      });
    }
    return h(
      'div',
      { className: cx('cl-art', 'cl-ph', 'cl-ph-' + hue(props.label)), role: 'img', 'aria-label': props.alt || props.label },
      h('span', { className: 'cl-ph__label' }, props.mark || props.label)
    );
  }

  function RatingBadge(props) {
    var v = Number(props.value);
    return h(
      'span',
      { className: cx('cl-rating', props.className), 'aria-label': 'Nota ' + v.toFixed(1) },
      h(Icon, { name: 'star', size: 14, fill: true }),
      v.toFixed(1)
    );
  }

  function PosterCard(props) {
    return h(
      'div',
      {
        className: cx('cl-poster', props.focused && 'is-focused'),
        tabIndex: 0,
        role: 'button',
        onClick: props.onClick
      },
      h(
        'div',
        { className: 'cl-poster__art', style: props.ratio ? { aspectRatio: props.ratio } : undefined },
        h(Art, { src: props.src, label: props.title, mark: props.title, alt: 'Pôster de ' + props.title, fit: props.fit }),
        props.rating != null && h(RatingBadge, { value: props.rating }),
        props.tag && h('span', { className: 'cl-tag' }, props.tag)
      ),
      h('div', { className: 'cl-poster__title', title: props.title }, props.title),
      (props.meta != null || props.year != null) && h('div', { className: 'cl-poster__year' }, props.meta != null ? props.meta : props.year)
    );
  }

  function CategoryMenu(props) {
    var items = props.items || [];
    return h(
      'nav',
      { className: 'cl-cats', 'aria-label': props.label || 'Categorias' },
      items.map(function (it) {
        var active = it.id === props.active;
        return h(
          'button',
          {
            key: it.id,
            type: 'button',
            className: cx('cl-cat', active && 'is-active', it.id === props.focusedId && 'is-focused'),
            'aria-current': active ? 'true' : undefined,
            onClick: function () {
              if (props.onSelect) props.onSelect(it.id);
            }
          },
          it.label,
          it.count ? h('span', { className: 'cl-cat__count' }, it.count) : null
        );
      })
    );
  }

  function MetaChips(props) {
    var genres = props.genres || [];
    return h(
      'div',
      { className: cx('cl-meta', props.className) },
      props.year && h('span', { className: 'cl-chip' }, props.year),
      props.rating != null &&
        h(
          'span',
          { className: 'cl-chip cl-chip--rating', 'aria-label': 'Nota ' + (props.source || 'IMDb') + ' ' + Number(props.rating).toFixed(1) },
          h(Icon, { name: 'star', size: 16, fill: true }),
          Number(props.rating).toFixed(1),
          h('span', { className: 'cl-chip__src' }, props.source || 'IMDb')
        ),
      props.age != null &&
        h('span', { className: 'cl-chip cl-chip--age', 'aria-label': 'Classificação indicativa ' + props.age }, props.age),
      genres.map(function (g) {
        return h('span', { className: 'cl-chip', key: g }, g);
      }),
      props.extra
    );
  }

  function CastAvatar(props) {
    return h(
      'div',
      { className: cx('cl-cast', props.focused && 'is-focused'), tabIndex: 0, role: 'button', onClick: props.onClick },
      h(
        'div',
        { className: 'cl-cast__photo' },
        h(Art, { src: props.src, label: props.name, mark: initials(props.name), alt: 'Foto de ' + props.name })
      ),
      props.character ? h('div', { className: 'cl-cast__role' }, props.character) : null,
      h('div', { className: props.character ? 'cl-cast__name' : 'cl-cast__role' }, props.name)
    );
  }

  function SeasonTabs(props) {
    var seasons = props.seasons || [];
    return h(
      'div',
      { className: 'cl-seasons', role: 'tablist', 'aria-label': 'Temporadas' },
      seasons.map(function (s, i) {
        var active = i === props.active;
        return h(
          'button',
          {
            key: i,
            type: 'button',
            role: 'tab',
            'aria-selected': active,
            className: cx('cl-season', active && 'is-active', i === props.focusedIndex && 'is-focused'),
            onClick: function () {
              if (props.onSelect) props.onSelect(i);
            }
          },
          s.label,
          s.episodes != null && h('span', { className: 'cl-season__count' }, s.episodes + ' ep')
        );
      })
    );
  }

  function EpisodeCard(props) {
    var hasProgress = props.progress != null && props.progress > 0;
    return h(
      'div',
      { className: cx('cl-ep', props.focused && 'is-focused'), tabIndex: 0, role: 'button', onClick: props.onClick },
      h(
        'div',
        { className: 'cl-ep__still' },
        h(Art, { src: props.still, label: 'Frame do episódio ' + props.number, mark: 'Frame do episódio', alt: 'Cena do episódio ' + props.number }),
        h('span', { className: 'cl-ep__num' }, props.number),
        hasProgress && h('span', { className: 'cl-ep__bar' }, h('span', { className: 'cl-ep__fill', style: { width: props.progress + '%' } }))
      ),
      h('div', { className: 'cl-ep__info' }, 'Temporada ' + pad(props.season) + ' · Episódio ' + pad(props.number)),
      h('div', { className: 'cl-ep__title' }, props.title),
      props.synopsis && h('p', { className: 'cl-ep__syn' }, props.synopsis),
      hasProgress && h('div', { className: 'cl-ep__resume' }, 'Continuar ' + props.progress + '%')
    );
  }

  function ActionButton(props) {
    return h(
      'button',
      {
        type: 'button',
        className: cx('cl-btn', props.variant === 'primary' && 'cl-btn--primary', props.focused && 'is-focused'),
        onClick: props.onClick
      },
      props.icon && h(Icon, { name: props.icon, size: 20 }),
      props.children
    );
  }

  function Field(props) {
    return h(
      'label',
      { className: cx('cl-field', props.error && 'has-error', props.className) },
      h('span', { className: 'cl-field__label' }, props.label),
      h('input', {
        className: 'cl-field__input',
        type: props.type || 'text',
        value: props.value == null ? '' : props.value,
        placeholder: props.placeholder,
        autoComplete: 'off',
        autoFocus: props.autoFocus,
        name: props.name,
        onChange: function (e) { if (props.onChange) props.onChange(e.target.value); },
        onKeyDown: props.onKeyDown
      }),
      (props.error || props.hint) && h('span', { className: 'cl-field__hint' }, props.error || props.hint)
    );
  }

  function ProfileItem(props) {
    var add = props.variant === 'add';
    return h(
      'div',
      { className: cx('cl-profile', props.active && 'is-active', props.focused && 'is-focused'), tabIndex: 0, role: 'button', onClick: props.onClick },
      h(
        'span',
        { className: cx('cl-profile__avatar', add ? 'is-add' : 'cl-av-' + (props.color || 'brand')) },
        add ? h(Icon, { name: 'plus', size: 28 }) : String(props.name || '?').charAt(0).toUpperCase(),
        props.active && h('span', { className: 'cl-profile__check' }, h(Icon, { name: 'check', size: 12 }))
      ),
      h('span', { className: 'cl-profile__name' }, props.name)
    );
  }

  function HubTile(props) {
    return h(
      'button',
      { type: 'button', className: cx('cl-hub', props.big && 'cl-hub--big', props.focused && 'is-focused'), onClick: props.onClick },
      h(Icon, { name: props.icon, size: props.big ? 40 : 28 }),
      h('span', { className: 'cl-hub__title' }, props.title),
      props.subtitle && h('span', { className: 'cl-hub__sub' }, props.subtitle)
    );
  }

  /* Campo numérico em "slots", para digitar com o teclado da tela (controle remoto). */
  function DigitField(props) {
    var v = String(props.value || ''), shown;
    if (!v) shown = h('span', { className: 'cl-digits__ph' }, props.placeholder || '');
    else if (props.masked) {
      var total = Math.max(props.slots || 0, v.length), dots = '';
      for (var i = 0; i < total; i++) dots += i < v.length ? '\u25CF ' : '\u25CB ';
      shown = dots.trim();
    } else shown = v.split('').join(' ');
    return h(
      'div',
      { className: cx('cl-digits', props.active && 'is-active', props.error && 'has-error'), tabIndex: 0, role: 'button', 'aria-label': props.label, onClick: props.onClick },
      h('span', { className: 'cl-digits__label' }, props.label),
      h('span', { className: 'cl-digits__value' }, shown)
    );
  }

  function NumericKeypad(props) {
    var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    function key(label, onClick, extra, aria) {
      return h('button', { type: 'button', key: aria || label, className: cx('cl-key', extra), 'aria-label': aria || label, onClick: onClick }, label);
    }
    return h(
      'div',
      { className: 'cl-keypad', role: 'group', 'aria-label': 'Teclado numérico' },
      keys.map(function (k) { return key(k, function () { props.onDigit(k); }); }),
      h('button', { type: 'button', key: 'bs', className: 'cl-key', 'aria-label': 'Apagar', onClick: props.onBackspace }, h(Icon, { name: 'backspace', size: 28 })),
      key('0', function () { props.onDigit('0'); }),
      h('button', { type: 'button', key: 'ok', className: 'cl-key cl-key--primary', 'aria-label': props.enterLabel || 'Confirmar', onClick: props.onEnter }, h(Icon, { name: 'check', size: 28 }))
    );
  }

  window.CinemaLivre = {
    DigitField: DigitField,
    NumericKeypad: NumericKeypad,
    Field: Field,
    ProfileItem: ProfileItem,
    HubTile: HubTile,
    Icon: Icon,
    RatingBadge: RatingBadge,
    PosterCard: PosterCard,
    CategoryMenu: CategoryMenu,
    MetaChips: MetaChips,
    CastAvatar: CastAvatar,
    SeasonTabs: SeasonTabs,
    EpisodeCard: EpisodeCard,
    ActionButton: ActionButton
  };
})();
