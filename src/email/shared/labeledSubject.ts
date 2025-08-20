const EMAIL_LABEL = "Clean Sight Solutions";

export function labeledSubject(subject: string, label?: string) {
    return `[${label ?? EMAIL_LABEL}] - ${subject}`;
}
