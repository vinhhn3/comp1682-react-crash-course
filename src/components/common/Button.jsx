export function Button({ variant = 'primary', block = false, children, ...rest }) {
  const classes = ['btn', `btn--${variant}`, block ? 'btn--block' : ''].filter(Boolean).join(' ');
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
