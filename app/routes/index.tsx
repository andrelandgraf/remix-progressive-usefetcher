import { NavLink } from "@remix-run/react";

export default function Index() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome</h1>
      <ul>
        <li>
          <NavLink to="without-javascript">
            Step 1: Without JavaScript
          </NavLink>
        </li>
        <li>
        <NavLink to="with-javascript">
            Step 2: Enhanced with JavaScript
          </NavLink>
        </li>
        <li>
        <NavLink to="with-javascript-better">
            Step 2: Enhanced with JavaScript (better)
          </NavLink>
        </li>
      </ul>
    </main>
  );
}
