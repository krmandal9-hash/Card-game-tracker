/**
 * Formats a numeric value into Rupee currency format (e.g., ₹1,200, -₹300, ₹0)
 */
export function formatRupees(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount).toLocaleString('en-IN');
  if (isNegative) {
    return `-₹${absAmount}`;
  }
  if (amount > 0) {
    return `+₹${absAmount}`;
  }
  return `₹0`;
}

/**
 * Formats Rupee without sign (+/-)
 */
export function formatRupeesPlain(amount: number): string {
  return `₹${Math.abs(amount).toLocaleString('en-IN')}`;
}

/**
 * Formats date into readable string (e.g., "31 Jul, 04:15 PM")
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Returns humanized relative time string (e.g., "2 mins ago", "Just now")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 10) return 'Just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;

    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return dateString;
  }
}
