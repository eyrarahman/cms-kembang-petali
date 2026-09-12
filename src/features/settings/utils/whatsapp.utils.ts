export function createWhatsappUrl(
    whatsappNumber: string,
    message?: string
) {
    const number =
        whatsappNumber
            .replace(/\D/g, "");

    const baseUrl =
        `https://wa.me/${number}`;

    if (!message) {
        return baseUrl;
    }

    return `${baseUrl}?text=${encodeURIComponent(
        message
    )}`;
}