export const formatDateTime = (date: Date): string => {
    const formattedDate = date.toLocaleDateString("en-GB", {
        year: "numeric",
        day: "numeric",
        month: "short",
    });

    const formattedTime = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    return `${formattedDate} ${formattedTime}`;
};
