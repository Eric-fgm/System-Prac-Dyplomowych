import { Input, Button, Label } from "../components";
import { useLoginMutation } from "../services/auth";

const LoginPage = () => {
  const { mutate } = useLoginMutation();

  const handleSubmit = (e) => {
    e.preventDefault();

    const credentials = {};
    for (var [key, value] of new FormData(e.target)) {
      credentials[key] = value;
    }

    mutate(credentials);
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md">
                    {/* <GalleryVerticalEnd className="size-6" /> */}
                  </div>
                </a>
                <h1 className="text-xl font-bold">Witaj w Systemie Dyplom</h1>
                <div className="text-center text-sm">
                  Logowanie do systemu
                  {/* Nie masz jeszcze konta?{" "}
                  <a href="#" className="underline underline-offset-4">
                    Sign up
                  </a> */}
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Twój email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Hasło</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Twoje hasło"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Zaloguj się
                </Button>
              </div>
            </div>
          </form>
          {/* <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
