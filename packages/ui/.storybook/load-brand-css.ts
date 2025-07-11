const brand = import.meta.env.VITE_BRAND ?? 'geek'

switch (brand) {
    case 'geek':
        import('@repo/tokens/dist/geek/css/_variables.css');
        break;
    case 'law':
        import('@repo/tokens/dist/law/css/_variables.css');
        break;
    case 'finance':
        import('@repo/tokens/dist/finance/css/_variables.css');
        break;
    default:
        import('@repo/tokens/dist/geek/css/_variables.css');
}
import '@repo/ds/dist/index.css';
