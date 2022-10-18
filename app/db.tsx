/**
 * Mock a database request with a timeout
 * The timeout is to simulate a slow database request
 * The function should fail 1/3 of the time
 */
export async function subscribeToNewsletter(name: string, email: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return Math.random() > 0.3;
}