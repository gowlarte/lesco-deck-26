/* @ds-bundle: {"format":4,"namespace":"LescoDesignSystem_23bc2e","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"ffeb89befa52","components/core/Button.jsx":"6ff6489ae026","components/core/Card.jsx":"c72b34713941","components/core/Icon.jsx":"4fcaa96d5fb7","components/core/IconButton.jsx":"6cd40e95fe70","components/forms/Checkbox.jsx":"1c92b4d3e2a2","components/forms/Input.jsx":"71fbd3359250","components/forms/Select.jsx":"13b580082cb4","components/forms/Switch.jsx":"3cb766dd7c4c","components/navigation/Tabs.jsx":"12f6f469fe18","ui_kits/website/Footer.jsx":"8427e2d105a5","ui_kits/website/Header.jsx":"1857a49d82d3","ui_kits/website/Home.jsx":"29e7f62ee11d","ui_kits/website/LineDetail.jsx":"6eaa0ecc7857","ui_kits/website/Proposal.jsx":"738484770919","ui_kits/website/Site.jsx":"54bfa942fca0","ui_kits/website/data.js":"27a11b3f2023"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LescoDesignSystem_23bc2e = window.LescoDesignSystem_23bc2e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Small status/label token. Solid ink, soft neutral, or line-tinted. */
function Badge({
  variant = 'soft',
  line,
  children,
  style = {},
  ...rest
}) {
  const tint = line ? {
    background: `var(--${line}-100)`,
    color: `var(--${line}-700)`,
    borderColor: `var(--${line}-200)`
  } : null;
  const variants = {
    solid: {
      background: 'var(--ink-900)',
      color: 'var(--paper)',
      borderColor: 'var(--ink-900)'
    },
    soft: {
      background: 'var(--surface-sunk)',
      color: 'var(--ink-700)',
      borderColor: 'transparent'
    },
    outline: {
      background: 'transparent',
      color: 'var(--ink-700)',
      borderColor: 'var(--ink-200)'
    }
  };
  const s = tint || variants[variant];
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 9px',
      fontFamily: 'var(--font-text)',
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.02em',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid transparent',
      ...s,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lesco Button — sober, near-square, quiet motion.
 * Variants: solid (ink), outline, ghost, accent (line-tinted). Sizes sm/md/lg.
 */
function Button({
  variant = 'solid',
  size = 'md',
  line,
  // optional: 'azul' | 'verde' | 'argila' | 'areia' — accent tint
  disabled = false,
  iconLeft = null,
  iconRight = null,
  children,
  style = {},
  ...rest
}) {
  const accent = line ? `var(--${line}-500)` : 'var(--azul-500)';
  const accentText = line ? `var(--${line}-700)` : 'var(--azul-700)';
  const sizes = {
    sm: {
      padding: '7px 14px',
      fontSize: 13,
      height: 34
    },
    md: {
      padding: '10px 20px',
      fontSize: 14,
      height: 42
    },
    lg: {
      padding: '14px 28px',
      fontSize: 16,
      height: 52
    }
  }[size];
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: 'var(--font-text)',
    fontWeight: 600,
    letterSpacing: '0.01em',
    lineHeight: 1,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)',
    opacity: disabled ? 0.45 : 1,
    whiteSpace: 'nowrap',
    ...sizes
  };
  const variants = {
    solid: {
      background: 'var(--ink-900)',
      color: 'var(--paper)',
      borderColor: 'var(--ink-900)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--ink-900)',
      borderColor: 'var(--ink-300)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--ink-800)',
      borderColor: 'transparent'
    },
    accent: {
      background: accent,
      color: 'var(--ink-900)',
      borderColor: accent
    }
  };
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const hoverStyle = !disabled && hover ? {
    solid: {
      background: 'var(--ink-700)',
      borderColor: 'var(--ink-700)'
    },
    outline: {
      borderColor: 'var(--ink-900)',
      color: 'var(--ink-900)'
    },
    ghost: {
      background: 'var(--surface-sunk)'
    },
    accent: {
      filter: 'brightness(0.96)'
    }
  }[variant] : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      ...base,
      ...variants[variant],
      ...hoverStyle,
      transform: press ? 'translateY(1px)' : 'none',
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Warm-paper surface with hairline border and soft lift. Optional line accent top-rule. */
function Card({
  line,
  hoverable = false,
  padding = 24,
  accentRule = false,
  children,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const accent = line ? `var(--${line}-500)` : 'var(--ink-900)';
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      boxShadow: hoverable && hover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      borderTop: accentRule ? `2px solid ${accent}` : '1px solid var(--border-hair)',
      transform: hoverable && hover ? 'translateY(-2px)' : 'none',
      transition: 'box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)',
      padding,
      overflow: 'hidden',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lesco Icon — thin wrapper over Lucide (1.5px geometric line set).
 * Requires the Lucide UMD script on the page: it reads window.lucide.icons[name].
 * `name` is Lucide's PascalCase key, e.g. "ArrowRight", "Leaf", "Ruler".
 */
function Icon({
  name,
  size = 20,
  stroke = 1.5,
  color = 'currentColor',
  style = {},
  ...rest
}) {
  const lib = typeof window !== 'undefined' && window.lucide && window.lucide.icons || {};
  const node = lib[name];
  if (!node) {
    return /*#__PURE__*/React.createElement("span", _extends({
      title: `icon: ${name}`,
      style: {
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: 2,
        border: '1px dashed var(--ink-300)',
        ...style
      }
    }, rest));
  }
  const children = Array.isArray(node) ? node : node.children || [];
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: 'inline-block',
      flexShrink: 0,
      ...style
    }
  }, rest), children.map(([tag, attrs], i) => React.createElement(tag, {
    key: i,
    ...attrs
  })));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Icon-only button, sober square. Variants match Button. */
function IconButton({
  variant = 'ghost',
  size = 'md',
  disabled = false,
  label,
  children,
  style = {},
  ...rest
}) {
  const dim = {
    sm: 34,
    md: 42,
    lg: 52
  }[size];
  const [hover, setHover] = React.useState(false);
  const variants = {
    solid: {
      background: 'var(--ink-900)',
      color: 'var(--paper)',
      borderColor: 'var(--ink-900)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--ink-800)',
      borderColor: 'var(--ink-300)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--ink-700)',
      borderColor: 'transparent'
    }
  }[variant];
  const hoverStyle = !disabled && hover ? {
    solid: {
      background: 'var(--ink-700)'
    },
    outline: {
      borderColor: 'var(--ink-900)',
      color: 'var(--ink-900)'
    },
    ghost: {
      background: 'var(--surface-sunk)'
    }
  }[variant] : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: dim,
      height: dim,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid transparent',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'all var(--dur-fast) var(--ease-standard)',
      ...variants,
      ...hoverStyle,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Checkbox with warm-paper box; checked fills ink. */
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  id,
  ...rest
}) {
  const cbId = id || React.useId();
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;
  const toggle = e => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: cbId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-text)',
      fontSize: 15,
      color: 'var(--ink-800)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: cbId,
    type: "checkbox",
    checked: on,
    onChange: toggle,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 'var(--radius-xs)',
      flexShrink: 0,
      border: `1.5px solid ${on ? 'var(--ink-900)' : 'var(--ink-300)'}`,
      background: on ? 'var(--ink-900)' : 'var(--surface)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all var(--dur-fast) var(--ease-standard)'
    }
  }, on && /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--paper)",
    strokeWidth: "3"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Text field — hairline border, warm focus ring, optional label/hint/error. */
function Input({
  label,
  hint,
  error,
  prefix,
  suffix,
  disabled = false,
  style = {},
  id,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || React.useId();
  const borderColor = error ? 'var(--argila-500)' : focus ? 'var(--azul-500)' : 'var(--ink-200)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-text)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--ink-800)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: disabled ? 'var(--surface-sunk)' : 'var(--surface)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-sm)',
      padding: '0 12px',
      height: 42,
      boxShadow: focus ? 'var(--shadow-focus)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
      opacity: disabled ? 0.6 : 1
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      display: 'inline-flex'
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'inherit',
      fontSize: 15,
      color: 'var(--ink-900)',
      minWidth: 0,
      ...style
    }
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      display: 'inline-flex'
    }
  }, suffix)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: error ? 'var(--argila-700)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Native select styled to match Input. */
function Select({
  label,
  hint,
  options = [],
  value,
  onChange,
  disabled = false,
  placeholder,
  style = {},
  id,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const selId = id || React.useId();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-text)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selId,
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--ink-800)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    value: value,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: 'none',
      width: '100%',
      height: 42,
      padding: '0 36px 0 12px',
      background: disabled ? 'var(--surface-sunk)' : 'var(--surface)',
      color: 'var(--ink-900)',
      border: `1px solid ${focus ? 'var(--azul-500)' : 'var(--ink-200)'}`,
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'inherit',
      fontSize: 15,
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: focus ? 'var(--shadow-focus)' : 'none',
      outline: 'none',
      transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lbl = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lbl);
  })), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-muted)",
    strokeWidth: "1.5",
    style: {
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Toggle switch — sober, settles to ink when on. */
function Switch({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  id,
  ...rest
}) {
  const swId = id || React.useId();
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;
  const toggle = e => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: swId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-text)',
      fontSize: 15,
      color: 'var(--ink-800)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: swId,
    type: "checkbox",
    checked: on,
    onChange: toggle,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 24,
      borderRadius: 'var(--radius-pill)',
      flexShrink: 0,
      background: on ? 'var(--ink-900)' : 'var(--ink-200)',
      padding: 3,
      transition: 'background var(--dur-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: 'var(--paper)',
      boxShadow: 'var(--shadow-xs)',
      transform: on ? 'translateX(16px)' : 'translateX(0)',
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  })), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/** Underline tabs — quiet, ink active indicator. */
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  style = {}
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? (tabs[0] && (tabs[0].value ?? tabs[0])));
  const isControlled = value !== undefined;
  const active = isControlled ? value : internal;
  const select = v => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--border-hair)',
      ...style
    }
  }, tabs.map(t => {
    const val = t.value ?? t;
    const lbl = t.label ?? t;
    const on = val === active;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      type: "button",
      onClick: () => select(val),
      style: {
        appearance: 'none',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontFamily: 'var(--font-text)',
        fontSize: 14,
        fontWeight: 600,
        color: on ? 'var(--ink-900)' : 'var(--text-muted)',
        padding: '10px 14px',
        borderBottom: `2px solid ${on ? 'var(--ink-900)' : 'transparent'}`,
        marginBottom: -1,
        transition: 'color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)'
      }
    }, lbl);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
// Lesco site footer
function Footer({
  go
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--ink-900)',
      color: 'var(--ink-200)',
      marginTop: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '64px 32px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 48,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 320
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.ASSET + 'logo-light.png',
    alt: "Lesco",
    style: {
      height: 34,
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      color: 'var(--paper)',
      textTransform: 'uppercase',
      letterSpacing: '-0.01em',
      lineHeight: 1.1
    }
  }, "Arquitetura feita", /*#__PURE__*/React.createElement("br", null), "para o amanh\xE3")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 56,
      fontFamily: 'var(--font-text)',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 12,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--ink-400)'
    }
  }, "Linhas"), ['Panel Shield', 'Brise', 'Green Brise'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => {
      e.preventDefault();
      go && go('lines');
    },
    style: {
      display: 'block',
      color: 'var(--ink-200)',
      textDecoration: 'none',
      marginBottom: 8
    }
  }, l))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 12,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--ink-400)'
    }
  }, "Contato"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px'
    }
  }, "Itaja\xED \u2014 SC \xB7 S\xE3o Paulo \u2014 SP"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px'
    }
  }, "(11) 3280-2554"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "lesco.com.br \xB7 @lesco_br")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48,
      paddingTop: 20,
      borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12,
      color: 'var(--ink-400)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Lesco. Todos os direitos reservados."), /*#__PURE__*/React.createElement("span", null, "Garantia de 10 anos \xB7 conforme termo."))));
}
Object.assign(window, {
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
// Lesco site header — logo, nav, CTA
function Header({
  route,
  go
}) {
  const {
    Button
  } = window.DS;
  const nav = [{
    id: 'home',
    label: 'Início'
  }, {
    id: 'lines',
    label: 'Linhas'
  }, {
    id: 'sobre',
    label: 'Sobre'
  }, {
    id: 'projetos',
    label: 'Projetos'
  }];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'rgba(244,239,230,0.86)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-hair)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '0 32px',
      height: 72,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('home');
    },
    style: {
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.ASSET + 'logo-dark.png',
    alt: "Lesco",
    style: {
      height: 30
    }
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 28
    }
  }, nav.map(n => /*#__PURE__*/React.createElement("a", {
    key: n.id,
    href: "#",
    onClick: e => {
      e.preventDefault();
      go(n.id === 'home' ? 'home' : n.id === 'lines' ? 'lines' : 'home');
    },
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 14,
      fontWeight: 600,
      color: route === n.id || route === 'line' && n.id === 'lines' ? 'var(--ink-900)' : 'var(--text-muted)',
      textDecoration: 'none',
      letterSpacing: '0.01em'
    }
  }, n.label))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => go('proposal')
  }, "Solicitar proposta")));
}
Object.assign(window, {
  Header
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
// Lesco homepage
function Home({
  go
}) {
  const {
    Button,
    Card,
    Badge
  } = window.DS;
  const LINES = window.LINES,
    VALUES = window.VALUES,
    A = window.ASSET;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      background: 'var(--ink-900)',
      color: 'var(--paper)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '120px 32px 128px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      color: 'var(--areia-300)'
    }
  }, "Revestimentos arquitet\xF4nicos \xB7 desde a mat\xE9ria-prima"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      color: 'var(--paper)',
      fontSize: 'clamp(48px,7vw,92px)',
      lineHeight: 0.98,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
      margin: '20px 0 0',
      maxWidth: 900
    }
  }, "Arquitetura feita", /*#__PURE__*/React.createElement("br", null), "para o amanh\xE3"), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: 560,
      marginTop: 26,
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--ink-200)'
    }
  }, "Revestimentos de alto padr\xE3o em mat\xE9rias-primas ecologicamente mais sustent\xE1veis \u2014 sem abrir m\xE3o da durabilidade e da qualidade est\xE9tica."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 34
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    line: "areia",
    size: "lg",
    onClick: () => go('proposal')
  }, "Solicitar proposta"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "lg",
    onClick: () => go('lines'),
    style: {
      color: 'var(--paper)',
      borderColor: 'rgba(255,255,255,0.32)'
    }
  }, "Conhecer as linhas")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 40,
      marginTop: 64
    }
  }, [['3', 'linhas de produto'], ['10 anos', 'de garantia'], ['+775 mil', 'em obras especificadas']].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 34,
      color: 'var(--paper)'
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-400)',
      letterSpacing: '0.04em'
    }
  }, l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 711,
      left: -10,
      width: 1143,
      height: 388,
      background: 'var(--degrade-brand)',
      filter: 'blur(90px)',
      opacity: 0.34,
      borderRadius: '50%'
    }
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '96px 32px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "As linhas"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 40,
      marginTop: 10
    }
  }, "Um sistema para cada superf\xEDcie")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('lines');
    },
    style: {
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--azul-700)'
    }
  }, "Ver todas as linhas \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 24
    }
  }, LINES.map(l => /*#__PURE__*/React.createElement(Card, {
    key: l.id,
    hoverable: true,
    accentRule: true,
    line: l.line,
    padding: 0,
    style: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column'
    },
    onClick: () => go('line', l.id)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 190,
      background: `var(--${l.line}-200)`,
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: `url(${A}symbol.png)`,
      backgroundSize: '150px',
      backgroundRepeat: 'repeat',
      opacity: 0.08
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 16,
      top: 16
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    line: l.line
  }, l.tag))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 24
    }
  }, l.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 16px',
      color: 'var(--text-muted)',
      fontSize: 14,
      minHeight: 40
    }
  }, l.blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      fontSize: 13,
      color: 'var(--text-faint)',
      fontFamily: 'var(--font-mono)',
      borderTop: '1px solid var(--border-soft)',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", null, l.dims), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, l.weight))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '96px 32px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 48
    }
  }, VALUES.map(v => /*#__PURE__*/React.createElement("div", {
    key: v.title
  }, /*#__PURE__*/React.createElement("img", {
    src: A + v.icon,
    alt: "",
    style: {
      height: 84,
      marginBottom: 20
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 22
    }
  }, v.title), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 8,
      color: 'var(--text-muted)',
      fontSize: 15,
      lineHeight: 1.6
    }
  }, v.body))))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '96px auto 0',
      padding: '0 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: 'var(--ink-900)',
      padding: '64px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--degrade-brand)',
      opacity: 0.16
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 32,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      color: 'var(--paper)',
      fontSize: 34,
      maxWidth: 560,
      textTransform: 'uppercase'
    }
  }, "Especifique Lesco no seu pr\xF3ximo projeto"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    line: "areia",
    size: "lg",
    onClick: () => go('proposal')
  }, "Solicitar proposta")))));
}
Object.assign(window, {
  Home
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/LineDetail.jsx
try { (() => {
// Lesco — product line detail
function LineDetail({
  lineId,
  go
}) {
  const {
    Button,
    Badge,
    Tabs,
    Card
  } = window.DS;
  const A = window.ASSET;
  const l = window.LINES.find(x => x.id === lineId) || window.LINES[0];
  const [tab, setTab] = React.useState('tecnica');
  const spec = [['Dimensões do módulo', l.dims], ['Peso', l.weight], ['Passo / módulo', l.module], ['Tratamento', 'UV / anti-UV'], ['Garantia', '10 anos (conforme termo)'], ['Aplicação', 'Fachada · forro · brise']];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '32px 32px 0',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('lines');
    },
    style: {
      color: 'var(--text-muted)'
    }
  }, "Linhas"), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: '0 8px'
    }
  }, "/"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-800)'
    }
  }, l.name)), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '32px 32px 0',
      display: 'grid',
      gridTemplateColumns: '1.05fr 1fr',
      gap: 56,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 440,
      borderRadius: 'var(--radius-lg)',
      background: `var(--${l.line}-200)`,
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid var(--border-hair)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: `url(${A}symbol.png)`,
      backgroundSize: '210px',
      backgroundRepeat: 'repeat',
      opacity: 0.09
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 20,
      top: 20
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    line: l.line
  }, l.tag))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 12
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      height: 84,
      borderRadius: 'var(--radius-sm)',
      background: `var(--${l.line}-${[100, 300, 500][i]})`,
      border: '1px solid var(--border-hair)'
    }
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      color: `var(--${l.line}-700)`
    }
  }, "Linha ", l.name), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'clamp(36px,4.5vw,56px)',
      margin: '12px 0 0',
      textTransform: 'uppercase',
      lineHeight: 1
    }
  }, l.tagline), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 20,
      fontSize: 17,
      lineHeight: 1.65,
      color: 'var(--text-body)'
    }
  }, l.blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 20,
      flexWrap: 'wrap'
    }
  }, l.finishes.map(f => /*#__PURE__*/React.createElement(Badge, {
    key: f,
    variant: "outline"
  }, f))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      value: 'tecnica',
      label: 'Ficha técnica'
    }, {
      value: 'apps',
      label: 'Aplicações'
    }, {
      value: 'sust',
      label: 'Sustentabilidade'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 22
    }
  }, tab === 'tecnica' && /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, spec.map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '13px 16px',
      background: i % 2 ? 'var(--surface)' : 'var(--paper-soft)',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--ink-900)',
      fontWeight: 500
    }
  }, v)))), tab === 'apps' && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: 0
    }
  }, "Especificada em fachadas ventiladas, forros e brises de projetos residenciais, corporativos e de hospitalidade \u2014 incluindo resorts de grande porte. Instala\xE7\xE3o por equipe do cliente, conforme plano de corte aprovado."), tab === 'sust' && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: 0
    }
  }, "Produzida a partir de mat\xE9rias-primas ecologicamente mais respons\xE1veis, com foco em durabilidade de longo prazo \u2014 a especifica\xE7\xE3o mais sustent\xE1vel \xE9 a que n\xE3o precisa ser trocada."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => go('proposal')
  }, "Solicitar proposta"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "lg"
  }, "Baixar ficha t\xE9cnica")))));
}
Object.assign(window, {
  LineDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/LineDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Proposal.jsx
try { (() => {
// Lesco — request-a-proposal form
function Proposal({
  go
}) {
  const {
    Button,
    Input,
    Select,
    Checkbox
  } = window.DS;
  const [sent, setSent] = React.useState(false);
  if (sent) {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        maxWidth: 560,
        margin: '0 auto',
        padding: '120px 32px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: window.ASSET + 'symbol.png',
      alt: "",
      style: {
        height: 64,
        marginBottom: 24
      }
    }), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 40,
        textTransform: 'uppercase'
      }
    }, "Proposta a caminho"), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: 14,
        fontSize: 16,
        color: 'var(--text-muted)'
      }
    }, "Recebemos seu pedido. O departamento comercial retorna em at\xE9 2 dias \xFAteis com a proposta detalhada e o plano de corte."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 28
      }
    }, /*#__PURE__*/React.createElement(Button, {
      onClick: () => go('home')
    }, "Voltar ao in\xEDcio")));
  }
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '56px 32px 0',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 64
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Departamento comercial"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'clamp(36px,4vw,52px)',
      margin: '12px 0 0',
      textTransform: 'uppercase',
      lineHeight: 1
    }
  }, "Solicitar", /*#__PURE__*/React.createElement("br", null), "proposta"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 20,
      fontSize: 17,
      lineHeight: 1.65,
      color: 'var(--text-body)',
      maxWidth: 400
    }
  }, "Conte sobre o projeto e a metragem estimada. Retornamos com valores por metro linear, condi\xE7\xF5es e prazo de entrega."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      borderLeft: '2px solid var(--verde-500)',
      paddingLeft: 18
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, "Itaja\xED \u2014 SC \xB7 S\xE3o Paulo \u2014 SP"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, "(11) 3280-2554 \xB7 lesco.com.br"))), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-lg)',
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nome",
    placeholder: "Seu nome",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Escrit\xF3rio / empresa",
    placeholder: "Est\xFAdio"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "E-mail",
    type: "email",
    placeholder: "voce@estudio.com",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Telefone",
    placeholder: "(00) 00000-0000"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Linha de interesse",
    placeholder: "Selecione",
    options: window.LINES.map(l => l.name)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Metragem estimada",
    suffix: "m/l",
    placeholder: "0,00"
  })), /*#__PURE__*/React.createElement(Input, {
    label: "Obra / localiza\xE7\xE3o",
    placeholder: "Ex.: Resort \u2014 Cai\xE7ara Cruz, CE"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Aceito receber a ficha t\xE9cnica e o termo de garantia por e-mail.",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "lg",
    style: {
      marginTop: 4
    }
  }, "Enviar solicita\xE7\xE3o")));
}
Object.assign(window, {
  Proposal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Proposal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Site.jsx
try { (() => {
// Lesco site — shell + simple client routing
function Lines({
  go
}) {
  const {
    Card,
    Badge
  } = window.DS;
  const A = window.ASSET;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '64px 32px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Portf\xF3lio de produtos"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'clamp(36px,4.5vw,56px)',
      margin: '12px 0 8px',
      textTransform: 'uppercase'
    }
  }, "Linhas Lesco"), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: 560,
      color: 'var(--text-muted)',
      fontSize: 17,
      marginBottom: 40
    }
  }, "Tr\xEAs sistemas de revestimento, cada um com sua tonalidade e fun\xE7\xE3o. Selecione para ver a ficha t\xE9cnica."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 24
    }
  }, window.LINES.map(l => /*#__PURE__*/React.createElement(Card, {
    key: l.id,
    hoverable: true,
    accentRule: true,
    line: l.line,
    padding: 0,
    style: {
      cursor: 'pointer'
    },
    onClick: () => go('line', l.id)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 220,
      background: `var(--${l.line}-200)`,
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: `url(${A}symbol.png)`,
      backgroundSize: '160px',
      backgroundRepeat: 'repeat',
      opacity: 0.08
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 16,
      top: 16
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    line: l.line
  }, l.tag))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 24
    }
  }, l.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 16px',
      color: 'var(--text-muted)',
      fontSize: 14
    }
  }, l.tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      fontSize: 13,
      color: 'var(--text-faint)',
      fontFamily: 'var(--font-mono)',
      borderTop: '1px solid var(--border-soft)',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", null, l.dims), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, l.weight)))))));
}
function Site() {
  const [route, setRoute] = React.useState('home');
  const [lineId, setLineId] = React.useState('brise');
  const go = (r, id) => {
    if (id) setLineId(id);
    setRoute(r);
    window.scrollTo({
      top: 0
    });
  };
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(Header, {
    route: route,
    go: go
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1
    }
  }, route === 'home' && /*#__PURE__*/React.createElement(Home, {
    go: go
  }), route === 'lines' && /*#__PURE__*/React.createElement(Lines, {
    go: go
  }), route === 'line' && /*#__PURE__*/React.createElement(LineDetail, {
    lineId: lineId,
    go: go
  }), route === 'proposal' && /*#__PURE__*/React.createElement(Proposal, {
    go: go
  })), /*#__PURE__*/React.createElement(Footer, {
    go: go
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(Site, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Site.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.js
try { (() => {
// Lesco website — shared design data + brand asset paths
const DS = window.LescoDesignSystem_23bc2e;
const ASSET = '../../assets/';
const LINES = [{
  id: 'panel-shield',
  name: 'Panel Shield',
  line: 'argila',
  tag: 'Painel',
  tagline: 'Superfície contínua, presença sólida.',
  blurb: 'Painéis de revestimento em madeira de alto padrão para fachadas e interiores. Encaixe preciso, leitura contínua.',
  dims: '268 × 20 mm',
  weight: '6,35 kg/m²',
  module: '268 mm',
  finishes: ['Tasmania Oak', 'Red Cedar · UV', 'Ipê escovado']
}, {
  id: 'brise',
  name: 'Brise',
  line: 'azul',
  tag: 'Brise',
  tagline: 'Ritmo, luz e sombra sob controle.',
  blurb: 'Sistema de brises ripados que filtram a luz com cadência. Perfis Origens para desenho de fachada e conforto térmico.',
  dims: '217 × 35 mm',
  weight: '14,15 kg/m²',
  module: '35 mm',
  finishes: ['Origens 40', 'Origens 60', 'Circular']
}, {
  id: 'green-brise',
  name: 'Green Brise',
  line: 'verde',
  tag: 'Sustentável',
  tagline: 'A mesma função, matéria-prima que devolve.',
  blurb: 'A linha sustentável da Lesco: matérias-primas ecologicamente responsáveis, sem abrir mão de durabilidade e estética.',
  dims: '200 × 50 mm',
  weight: '3,30 kg/mL',
  module: '50 mm',
  finishes: ['Origens 40', 'Textura natural', 'Baixa emissão']
}];
const VALUES = [{
  icon: 'grafismo-2.png',
  title: 'Estética que inspira',
  body: 'Cada superfície é pensada como assinatura visual do projeto.'
}, {
  icon: 'grafismo-3.png',
  title: 'Valor da função',
  body: 'Desempenho técnico verificável — dimensões, peso e garantia.'
}, {
  icon: 'grafismo-1.png',
  title: 'Arquitetura com propósito',
  body: 'Matéria-prima mais sustentável, durabilidade de longo prazo.'
}];
Object.assign(window, {
  DS,
  ASSET,
  LINES,
  VALUES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
