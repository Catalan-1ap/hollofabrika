export default {
	Query: {
		users: (_, args, context) => {
			console.log("users", { args, context })
			return [
				{
					username: "2",
				},
				{
					username: "3",
				},
			]
		}
	}
}