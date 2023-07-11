{"version":1,"type":"collection","title":"Hollofabrika","queries":[{"version":1,"type":"window","query":"query {\n\tcurrentUser {\n\t\tusername\n\t\temail\n\t\trole\n\t}\n}\n","apiUrl":"{{deployed}}","variables":"{}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[{"key":"Authorization","value":"Bearer {{tokens.access}}","enabled":true}],"windowName":"Current User","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"9137dfa9-95cd-46c8-ad53-1221c7a6c2c6","created_at":1687809118791,"updated_at":1688307219844},{"version":1,"type":"window","query":"mutation($token: String!) {\n\trefresh(token: $token) {\n\t\taccess\n\t\trefresh\n\t}\n}\n","apiUrl":"{{deployed}}","variables":"{\n  \"token\": \"{{tokens.refresh}}\"\n}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[{"key":"","value":"","enabled":true}],"windowName":"Refresh","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"8f03e0f6-72ef-48a1-a4e5-6bed5ce05147","created_at":1687809138392,"updated_at":1688307260474},{"version":1,"type":"window","query":"\nmutation {\n\tlogin(username: \"test\", password: \"secure\") {\n\t\taccess\n\t\trefresh\n\t}\n}","apiUrl":"{{deployed}}","variables":"{}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[{"key":"","value":"","enabled":true}],"windowName":"Login","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"8089cc32-cf35-4736-ac76-669f4dac25ad","created_at":1687809149443,"updated_at":1688307231447},{"version":1,"type":"window","query":"mutation {\n\tregister(username: \"test\", email: \"test1@gmail.com\", password: \"secure\") {\n\t\tconfirmToken\n\t}\n}","apiUrl":"{{deployed}}","variables":"{}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[{"key":"Authorization","value":"Bearer {{tokens.access}}","enabled":true}],"windowName":"Register ","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"7121866f-bded-4168-b51d-150d8f2e1cc2","created_at":1687809195498,"updated_at":1688307266713},{"version":1,"type":"window","query":"mutation($confirmToken: String!) {\n\tverifyEmail(emailToken: 111111, confirmToken: $confirmToken) {\n\t\tcode\n\t}\n}","apiUrl":"{{deployed}}","variables":"{}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[{"key":"","value":"","enabled":true}],"windowName":"Verify Email","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"0af06c35-0ddb-407e-8e65-bc8ffd0c0412","created_at":1687809298944,"updated_at":1688307287538},{"version":1,"type":"window","query":"query {\n\tcategories {\n\t\tname\n\t\tattributes {\n\t\t\tname\n\t\t\tvalue\n\t\t\tcount\n\t\t}\n\t}\n}\n","apiUrl":"{{deployed}}","variables":"{}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[{"key":"Authorization","value":"Bearer {{tokens.access}}","enabled":true}],"windowName":"Categories","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"a724aa2a-c20c-4143-af03-bb36fe111b8a","created_at":1687809468549,"updated_at":1688307188271},{"version":1,"type":"window","query":"mutation {\n\tcreateCategory(name: \"Тест1\") {\n\t\tname\n\t\tattributes {\n\t\t\tname\n\t\t\tvalue\n\t\t\tcount\n\t\t}\n\t}\n}","apiUrl":"{{deployed}}","variables":"{}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[{"key":"Authorization","value":"Bearer {{tokens.access}}","enabled":true}],"windowName":"Create Category","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"729f9dd9-0cb4-41b5-883d-caae077317eb","created_at":1687809633348,"updated_at":1688307200694},{"version":1,"type":"window","query":"mutation {\n\tdeleteCategory(name: \"Тест1\") {\n\t\tname\n\t\tattributes {\n\t\t\tname\n\t\t\tvalue\n\t\t\tcount\n\t\t}\n\t}\n}","apiUrl":"http://localhost:3333/graphql","variables":"{}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[{"key":"Authorization","value":"Bearer {{tokens.access}}","enabled":true}],"windowName":"Delete Category","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"21116abc-2f37-4428-8047-853d9125e585","created_at":1687809668482,"updated_at":1687892853688},{"version":1,"type":"window","query":"mutation {\n\tupdateCategory(originalName: \"Тест2\", newName: \"Тест1\") {\n\t\tname\n\t\tattributes {\n\t\t\tname\n\t\t\tvalue\n\t\t\tcount\n\t\t}\n\t}\n}","apiUrl":"{{deployed}}","variables":"{}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[{"key":"Authorization","value":"Bearer {{tokens.access}}","enabled":true}],"windowName":"Update Category","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"861f0edd-82ba-46e5-9288-c13017e85f0a","created_at":1687809690000,"updated_at":1688307274896},{"version":1,"type":"window","query":"query {\n\tproducts(input: {\n# \t\tids: [\n# \t\t\"cHJvZHVjdHMtMWY0OWNkY2UtNGQzMC00MDVkLTg5YTAtNzU1OGI0ODY0M2UyLzMzOTU1\",\n# \t\t]\n# \t\tcategories: [\n# \t\t\t\"Тест2\"\n# \t\t]\n# \t\tpageData: {\n# \t\t\tpage: 1,\n# \t\t\tpageSize: 1\n# \t\t}\n# \t\tfilter: {\n# \t\t\tlogic: AND\n# \t\t\tattributes: [\n# \t\t\t\t{\n# \t\t\t\t\tname: \"цвет\",\n# \t\t\t\t\tvalue: \"красный\"\n# \t\t\t\t},\n# \t\t\t\t{\n# \t\t\t\t\tname: \"обьем\",\n# \t\t\t\t\tvalue: \"2л\"\n# \t\t\t\t}\n# \t\t\t]\n# \t\t} \n\t}) {\n\t\tpageData {\n\t\t\ttotalPages\n\t\t\tpage\n\t\t\tpageSize\n\t\t}\n\t\titems {\n\t\t\tid\n\t\t\tcovers\n\t\t\tcategory\n\t\t\tdescription\n\t\t\tname\n\t\t\tprice\n\t\t\tattributes {\n\t\t\t\tname\n\t\t\t\tvalue\n\t\t\t}\n\t\t}\n\t}\n}","apiUrl":"{{deployed}}","variables":"{}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[{"key":"Authorization","value":"Bearer {{tokens.access}}","enabled":true}],"windowName":"Products","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"87c9dccc-73ba-4e4a-8abe-3479ee18ca51","created_at":1687810038398,"updated_at":1688307251833},{"version":1,"type":"window","query":"query Product($id: Id!) {\n\tproduct(id: $id) {\n\t\tid\n\t\tcovers\n\t\tcategory\n\t\tdescription\n\t\tname\n\t\tprice\n\t\tattributes {\n\t\t\tname\n\t\t\tvalue\n\t\t}\n\t}\n}\n","apiUrl":"{{deployed}}","variables":"{\n  \"id\": \"cHJvZHVjdHMtNDUwZWE2YzgtYTkxMy00ZjZmLWIxYzUtZGY2OWI1YmJhMjQ1LzU1NjQy\"\n}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[{"key":"Authorization","value":"Bearer {{tokens.access}}","enabled":true}],"windowName":"Product","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"fb44ba78-df23-4265-9b52-45107e6551f4","created_at":1687810137411,"updated_at":1688307237903},{"version":1,"type":"window","query":"mutation CreateProduct($covers: [Upload!]) {\n\tcreateProduct(\n\t\tcategory: \"Тест1\"\n\t\tproduct: {\n\t\t\tname: \"Тестовый продукт2\"\n\t\t\tdescription: \"Описание\"\n\t\t\tprice: 100\n      covers: $covers\n\t\t\tattributes: [\n\t\t\t\t{ name: \"цвет\", value: \"зеленый\" }\n\t\t\t]\n\t\t}\n\t) {\n\t\tid\n\t\tdescription\n\t\tname\n\t\tprice\n\t\tattributes {\n\t\t\tname\n\t\t\tvalue\n\t\t}\n\t}\n}\n","apiUrl":"{{deployed}}","variables":"{}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[{"key":"Authorization","value":"Bearer {{tokens.access}}","enabled":true},{"key":"apollo-require-preflight","value":"true","enabled":true}],"windowName":"Create Product","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"52dd64c0-8d48-4b0e-a979-c1b6a9a38e52","created_at":1687810345889,"updated_at":1688307208482},{"version":1,"type":"window","query":"mutation DeleteProduct($id: Id!) {\n\tdeleteProduct(id: $id) {\n\t\tid\n\t\tcovers\n\t\tdescription\n\t\tname\n\t\tprice\n\t\tattributes {\n\t\t\tname\n\t\t\tvalue\n\t\t}\n\t}\n}","apiUrl":"{{deployed}}","variables":"{\n  \"id\": \"cHJvZHVjdHMtNDUwZWE2YzgtYTkxMy00ZjZmLWIxYzUtZGY2OWI1YmJhMjQ1LzY2MDQ4\"\n}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[{"key":"Authorization","value":"Bearer {{tokens.access}}","enabled":true},{"key":"Apollo-Require-Preflight","value":"true","enabled":true}],"windowName":"Delete Product","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"35ac16a1-a0b6-4ca5-8035-87b0f453c57b","created_at":1687810516247,"updated_at":1688307226098},{"version":1,"type":"window","query":"mutation UpdateProduct($id: Id!) {\n\tupdateProduct(id: $id, product: {\n\t\tname: \"Обновленный продукт2\",\n\t\tprice: 200,\n\t\tattributes: [\n\t\t\t{\n\t\t\t\tname: \"цвет\",\n\t\t\t\tvalue: \"синий\"\n\t\t\t}\n\t\t]\n\t}) {\n\t\tid\n\t\tdescription\n\t\tname\n\t\tprice\n\t\tattributes {\n\t\t\tname\n\t\t\tvalue\n\t\t}\n\t}\n}","apiUrl":"{{deployed}}","variables":"{\n  \"id\": \"cHJvZHVjdHMtNDUwZWE2YzgtYTkxMy00ZjZmLWIxYzUtZGY2OWI1YmJhMjQ1LzY1MTc4\"\n}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[{"key":"Authorization","value":"Bearer {{tokens.access}}","enabled":true},{"key":"Apollo-Require-Preflight","value":"true","enabled":true}],"windowName":"Update Product","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"d029c5f0-7772-459b-885c-de4c5a37844f","created_at":1687810637224,"updated_at":1688307282044},{"version":1,"type":"window","query":"mutation ChangeCategory($id: Id!) {\n\tchangeCategory(id: $id, category: \"Тест1\") {\n\t\tid\n\t\tdescription\n\t\tname\n\t\tprice\n\t\tattributes {\n\t\t\tname\n\t\t\tvalue\n\t\t}\n\t}\n}","apiUrl":"{{deployed}}","variables":"{\n  \"id\": \"cHJvZHVjdHMtNDUwZWE2YzgtYTkxMy00ZjZmLWIxYzUtZGY2OWI1YmJhMjQ1LzY5MzYz\"\n}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[{"key":"Authorization","value":"Bearer {{tokens.access}}","enabled":true}],"windowName":"Change Product Category","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"682e49a3-16ab-4f57-a9b5-ff2ae4dc4b57","created_at":1688071374419,"updated_at":1688307194039}],"preRequest":{"script":"","enabled":false},"postRequest":{"script":"","enabled":false},"id":"f7cfae65-9ed5-47c6-af9f-a6c3be13414b","parentPath":"","created_at":1687808702559,"updated_at":1687808702559,"collections":[]}