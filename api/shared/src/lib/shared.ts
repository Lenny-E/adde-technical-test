export function verify_password(password : string) : boolean{
  return password.length > 3;
}

export function verify_email(email : string) : boolean{
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
}

export function delete_xss(input : string) : string{
  return input.replace(/[<>]/g, "");
}

export function verify_name(name: string): boolean {
  const nameRegex = /^[A-Za-z]+$/;
  return nameRegex.test(name);
}