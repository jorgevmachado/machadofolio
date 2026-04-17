export default function useActiveBrand() {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand-name').replace(/['"]/g, '').trim();
}