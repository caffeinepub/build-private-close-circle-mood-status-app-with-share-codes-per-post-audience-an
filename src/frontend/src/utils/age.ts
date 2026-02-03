/**
 * Calculates age from a date of birth stored as bigint (milliseconds since epoch)
 * Returns null if the date is invalid or in the future
 */
export function calculateAge(dateOfBirthMs: bigint): number | null {
  try {
    const dob = new Date(Number(dateOfBirthMs));
    const today = new Date();
    
    // Check if date is valid and not in the future
    if (isNaN(dob.getTime()) || dob > today) {
      return null;
    }
    
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    // Adjust age if birthday hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age >= 0 ? age : null;
  } catch {
    return null;
  }
}

/**
 * Formats a date of birth for display in input fields (YYYY-MM-DD)
 */
export function formatDateForInput(dateMs: bigint): string {
  try {
    const date = new Date(Number(dateMs));
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
}

/**
 * Converts a date input string (YYYY-MM-DD) to milliseconds bigint
 */
export function parseDateInput(dateString: string): bigint {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return BigInt(0);
    return BigInt(date.getTime());
  } catch {
    return BigInt(0);
  }
}
