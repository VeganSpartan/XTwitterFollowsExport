(async () => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const extractUsers = () => {
    console.log("Extracting users...");
    const userElements = document.querySelectorAll('[data-testid="UserCell"] a[href^="/"]');
    console.log(`Elements found: ${userElements.length}`);

    const users = Array.from(userElements)
      .filter(el => 
        el.closest('[data-testid="UserCell"]') && // Make sure you are in a UserCell
        !el.closest('.css-175oi2r.r-1bro5k0') && // Exclude links within "Who to follow"
        el.getAttribute("href").startsWith("/") && // Only links related to profiles
        el.querySelector('span') // Exclude links without visible text
      )
      .map(el => el.getAttribute("href").split('/').pop().toLowerCase()) // Extract username
      .filter(username => 
        username && 
        /^[a-zA-Z0-9_]+$/.test(username) // Validate usernames
      );

    console.log(`Users extracted: ${users.length}`);
    return users;
  };

  const scrollToEnd = async () => {
    let prevHeight = 0;
    let currHeight = document.body.scrollHeight;
    const users = new Set();

    console.log("Starting movement...");
    let retries = 0;

    while (prevHeight !== currHeight || retries < 5) {
      const extractedUsers = extractUsers();
      extractedUsers.forEach(user => users.add(user));

      window.scrollTo(0, currHeight);
      prevHeight = currHeight;

      await delay(3000); // Wait 3 seconds to load more data
      currHeight = document.body.scrollHeight;

      if (prevHeight === currHeight) {
        retries += 1; // Increment attempt counter when no changes are detected
      } else {
        retries = 0; // Reset the counter if we detect more data loaded
      }
    }

    console.log(`Total users catched: ${users.size}`);
    return Array.from(users);
  };

  const users = await scrollToEnd();

  console.log("Creating file...");
  const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'twitter_following.json';
  link.click();

  alert(`Export complete. ${users.length} users have been exported.`);
})();
