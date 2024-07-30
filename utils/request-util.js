export function getServerDomainForBrowser() {
  return process.env.NEXT_PUBLIC_serverDomainBrowser ?? process.env.NEXT_PUBLIC_serverDomain;
}
