# Somnia Domains (.somi) | Somnia Docs

Copy

  1. [Developer](/developer)
  2. [DEPLOYMENT AND PRODUCTION](/developer/deployment-and-production)
  3. [ecosystem](/developer/deployment-and-production/ecosystem)
  4. [Ecosystem Showcase](/developer/deployment-and-production/ecosystem/ecosystem-showcase)



# Somnia Domains (.somi)

## 

Somnia Domains (.somi)

## 

1\. For Users

### 

How to Claim a Domain?

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F1861192046-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FFxD3cqyyFDzHJ0nfCPfy%252Fuploads%252FfwLeZD5ZZaXx6rMkgBQc%252FEkran%2520Resmi%25202025-10-20%252002.09.07.png%3Falt%3Dmedia%26token%3D5025bb87-7cda-494e-8760-f4e389462b12&width=768&dpr=4&quality=100&sign=ccaf55b0&sv=2)

  1. Go to [somnia.domains](https://somnia.domains) and connect your wallet.

  2. Enter the domain you wish to claim in the “Domain Name” field.

  3. If the domain address has not been reserved or claimed, you can claim it.

  4. Claim periods of 1, 2, or 3 years are available. If you wish to extend it further, you can extend the period by clicking the “Renew” button in the “Domain Management” menu.

  5. Domains that are not renewed before their expiration date will automatically expire and become available for others to claim.




### 

How to Set Primary Domain?

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2F1861192046-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FFxD3cqyyFDzHJ0nfCPfy%252Fuploads%252F0PC3aXdsEZgOHGlfnQ3i%252FEkran%2520Resmi%25202025-10-20%252002.31.22.png%3Falt%3Dmedia%26token%3Dd19eca22-95af-423b-be86-d3e0a3e3cf01&width=768&dpr=4&quality=100&sign=89dc7e4f&sv=2)

  1. You can view the domains you own from the “Domain Management” menu.

  2. Here, you can set your desired domain as the Primary Domain.

  3. Your primary domain is the domain that dApps can access via API. You can remove it or change it to another domain at any time.




## 

2\. For Developers

**.somi API**

Copy
    
    
    https://api.somnia.domains/api/primary-domain/{walletAddress}

You can retrieve the primary domain data of wallets using somi's API. This allows users to see their Primary Domains instead of their wallet addresses in the frontend.

### 

What does the API returns?

Copy
    
    
    {
    "wallet":"0x4F40da1a67b891Ec7cCD54F809AFDD72CCc07BEC",
    "primaryDomain":"primary.somi",
    "hasPrimary":true
    }

You can display the `wallet` or `primaryDomain` strings in your frontend using the `hasPrimary` boolean value.

[PreviousNFTs2Me](/developer/deployment-and-production/ecosystem/ecosystem-showcase/nfts2me)[NextSomnia Exchange](/developer/deployment-and-production/ecosystem/ecosystem-showcase/somnia-exchange)

Last updated 13 days ago
