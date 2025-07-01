// import {jwtDecode} from "jwt-decode";

// export function GetTokenFromCookie() {
//   const token = document.cookie
//     .split('; ')
//     .find(row => row.startsWith('token='))
//     ?.split('=')[1];

//   if (!token) return null;

//   try {
//     const decoded = jwtDecode(token);  // <-- Yaha se user info milega
//     console.log("Decoded Token:", decoded);
//     return decoded; // return user info
//   } catch (err) {
//     console.error("Invalid token:", err);
//     return null;
//   }
// }






import { jwtDecode } from "jwt-decode";

// Check if token is expired
function isTokenExpired(decoded) {
  if (!decoded?.exp) return true;
  const currentTime = Date.now() / 1000; // in seconds
  return decoded.exp < currentTime;
}

// Main function to get user info from token
export function GetTokenFromCookie() {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    console.warn("Token not found in cookie");
    return null;
  }

  try {
    const decoded = jwtDecode(token);

    if (isTokenExpired(decoded)) {
      console.warn("Token has expired");
      return null;
    }

    return decoded;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

