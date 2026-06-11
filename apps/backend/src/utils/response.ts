export function ok<T>(data: T, message = 'Muvaffaqiyatli') {
  return { success: true, message, data };
}

export function fail(message: string) {
  return { success: false, message, data: null };
}
