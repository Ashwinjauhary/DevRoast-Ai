const SECRET_PATTERNS = [
    // AWS Client ID
    /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g,
    // GitHub Classic Token
    /ghp_[a-zA-Z0-9]{36}/g,
    // GitHub Fine-Grained Token
    /github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}/g,
    // Stripe Standard
    /sk_live_[0-9a-zA-Z]{24}/g,
    // Slack Token
    /xox[baprs]-([0-9a-zA-Z]{10,48})?/g,
    // Google API Key
    /AIza[0-9A-Za-z\\-_]{35}/g,
    // RSA Private Key header
    /-----BEGIN RSA PRIVATE KEY-----/g,
    // Generic API Key identifiers (heuristic)
    /(?:api_key|apikey|secret_key|secretkey|access_token)[\s]*[:=][\s]*["']?([a-zA-Z0-9\-_]{16,})["']?/gi,
    // Passwords in config strings (heuristic)
    /(?:password|db_pass)[\s]*[:=][\s]*["']?([a-zA-Z0-9\-_@!#]{8,})["']?/gi
];

export interface SecretScanResult {
    hasSecrets: boolean;
    matches: string[];
    cleanText: string;
}

/**
 * Scans a string of code/text for potential leaked secrets.
 * Masks them with [REDACTED_SECRET] to securely pass to AI APIs.
 */
export function scanForSecrets(text: string): SecretScanResult {
    if (!text || typeof text !== 'string') return { hasSecrets: false, matches: [], cleanText: text || '' };

    let cleanText = text;
    const allMatches: string[] = [];

    // Apply exact patterns first
    for (const pattern of SECRET_PATTERNS) {
        // We need to reset lastIndex if it's a global regex, though match() handles it
        const found = text.match(pattern);
        if (found) {
            allMatches.push(...found);
            cleanText = cleanText.replace(pattern, "[REDACTED_SECRET]");
        }
    }

    return {
        hasSecrets: allMatches.length > 0,
        matches: Array.from(new Set(allMatches)), // deduplicate
        cleanText,
    };
}
