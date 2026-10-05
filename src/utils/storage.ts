// setInStorage
export function setInStorage(key: string, obj: any) {
    if (!key || typeof window === "undefined") return;
    try {
        localStorage.setItem(key, JSON.stringify(obj));
    } catch (err) {
        console.error(err);
    }
}

//getFromStorage
export function getFromStorage(key: string) {
    if (!key || typeof window === "undefined") return null;
    try {
        const valueStr = localStorage.getItem(key);
        if (!valueStr) return null;
        try {
            return JSON.parse(valueStr);
        } catch {
            return valueStr;
        }
    } catch {
        return null;
    }
}

// removeFromStorage
export function removeFromStorage(key: string) {
    if (!key || typeof window === "undefined") return;
    try {
        localStorage.removeItem(key);
    } catch (err) {
        console.error(err);
    }
}

export function setInSessionStorage(key: string, obj: any) {
    if (!key || typeof window === "undefined") return;

    try {
        sessionStorage.setItem(key, JSON.stringify(obj));
    } catch (err) {
        console.error(err);
    }
}
export function removeFromSessionStorage(key: string) {
    if (!key || typeof window === "undefined") return;
    try {
        sessionStorage.removeItem(key);
    } catch (err) {
        console.error(err);
    }
}
export function getFromSessionStorage(key: string) {
    if (!key || typeof window === "undefined") return null;

    try {
        const valueStr = sessionStorage.getItem(key);

        if (!valueStr) return null;

        try {
            return JSON.parse(valueStr);
        } catch {
            return valueStr;
        }
    } catch {
        return null;
    }
}


// get bearer token for authorization example
export function getPersistedAuth() {
    const raw = getFromStorage("persist:auth");
    if (!raw || typeof raw !== "object") return null;

    const parseField = (value: any) => {
        if (value == null) return null;
        if (typeof value !== "string") return value;
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    };

    return {
        user: parseField(raw.user),
        token: parseField(raw.token),
        expireAt: parseField(raw.expireAt),
        isAuthenticated: parseField(raw.isAuthenticated),
    };
}

export function Authorization() {
    const persisted = getPersistedAuth();
    const token = persisted?.token || getFromStorage("token");
    if (!token) return null;
    return String(token).replace(/^Bearer\s+/i, "");
}

export function getSessionId() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("sessionId") || getFromStorage("sessionId");
}