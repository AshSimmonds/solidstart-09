import { Match, Switch, type Component } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { authenticator, type User } from "~/server/auth";

export const withProtected = (Component: ProtectedRouter) => {
  const routeData = () => {
    return createServerData$(async (_, { request }) => {
      const user = await authenticator.isAuthenticated(request);
      if (!user) {
        throw redirect("/");
      }
      return user;
    });
  };
  return {
    routeData,
    Page: () => {
      const current = useRouteData<typeof routeData>();
      return (
        <Switch fallback={<Component {...(current() as User)} />}>
          <Match when={current.loading || current() instanceof Response}>
            <h1>Loading...</h1>
          </Match>
        </Switch>
      );
    },
  };
};

export type ProtectedRouter = Component<User>;
