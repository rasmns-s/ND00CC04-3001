// scripts/discord-client.js - Discord client mockup functionality

// Helper function for smooth scrolling
function smoothScrollTo(container, targetPosition) {
  if (!container) return;
  
  if ('scrollBehavior' in document.documentElement.style) {
    container.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  } else {
    container.scrollTop = targetPosition;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initDiscordClient();
  document.querySelectorAll('.burger-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const channelList = document.querySelector('.channel-list');
      if (channelList) {
        channelList.classList.toggle('closed');
      }
    });
  });
});

function initDiscordClient() {
  const discordLoader = document.getElementById('discord-loader');
  const discordClient = document.querySelector('.discord-client');
  const channels = Array.from(document.querySelectorAll('.channel'));
  const sections = Array.from(document.querySelectorAll('.chat-section'));
  let currentIndex = 0;
  let scrollCooldown = false;
  
  // Track which channels have been visited already
  const channelsVisited = {};
  
  // Track if a smooth scroll animation is in progress
  let smoothScrollInProgress = false;

  // Buffer zone configuration
  const BUFFER_SCROLL_THRESHOLD = 3; // Number of consecutive scrolls needed to switch channels
  let bufferScrollCount = 0; // Current buffer count
  let lastScrollDirection = 0; // Last scroll direction (-1 up, 1 down)
  let bufferResetTimeout = null; // Timeout to reset buffer if user pauses scrolling

  
  // Enhanced smoothScrollTo function to track animation state
  function enhancedSmoothScrollTo(container, targetPosition) {
    if (!container) return;
    
    smoothScrollInProgress = true;
    
    if ('scrollBehavior' in document.documentElement.style) {
      container.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Set a timeout to clear the flag after animation completes
      setTimeout(() => {
        smoothScrollInProgress = false;
      }, 500);
    } else {
      container.scrollTop = targetPosition;
      smoothScrollInProgress = false;
    }
  }
  
  // Find initially selected channel
  const initiallySelectedChannel = channels.find(ch => ch.classList.contains('selected'));
  if (initiallySelectedChannel) {
    const initialIndex = parseInt(initiallySelectedChannel.dataset.index, 10);
    if (!isNaN(initialIndex) && sections[initialIndex]) {
      currentIndex = initialIndex;
      sections.forEach((el, i) => el.classList.toggle('visible', i === currentIndex));
    } else {
      if (sections.length > 0) {
        sections[0].classList.add('visible');
        if(channels.length > 0) channels[0].classList.add('selected');
        currentIndex = 0;
      }
    }
  } else if (channels.length > 0 && sections.length > 0) {
    channels[0].classList.add('selected');
    sections[0].classList.add('visible');
    currentIndex = 0;
  }
  
  // Handle Discord loader
  if (discordLoader) {
    setTimeout(() => {
      discordLoader.classList.remove('discord-loader-active');
      
      // Handle scrolling based on which section is visible
      const visibleSection = document.querySelector('.chat-section.visible');
      if (visibleSection) {
        const visibleIndex = parseInt(visibleSection.dataset.index, 10);
        const messagesContainer = visibleSection.querySelector('.chat-messages');
        
        if (messagesContainer) {
          setTimeout(() => {
            // Mark the initial visible channel as visited
            channelsVisited[visibleIndex] = true;
            
            // Initial auto-scroll for the first visible channel
            if (visibleIndex === 1) { // säännöt channel
              enhancedSmoothScrollTo(messagesContainer, 0);
            } else {
              // For other channels, scroll to the top of the last message
              const messages = messagesContainer.querySelectorAll('.message');
              if (messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                const topPosition = lastMessage.offsetTop - 20;
                enhancedSmoothScrollTo(messagesContainer, topPosition);
              } else {
                enhancedSmoothScrollTo(messagesContainer, messagesContainer.scrollHeight);
              }
            }
          }, 20);
        }
      }
    }, 2500);
  }
  
  // Discord alert close button
  const closeAlert = document.querySelector('.close-alert');
  if (closeAlert) {
    closeAlert.addEventListener('click', () => {
      const discordAlert = document.getElementById('discord-alert');
      if (discordAlert) {
        discordAlert.classList.remove('show');
      }
    });
  }
  
  // Channel switching function
  function showChannel(index) {
    if (index >= 0 && index < sections.length) {
      channels.forEach((el, i) => el.classList.toggle('selected', i === index));
      sections.forEach((el, i) => {
        const isVisible = i === index;
        el.classList.toggle('visible', isVisible);
        
        if (isVisible) {
          const messagesContainer = el.querySelector('.chat-messages');
          if (messagesContainer) {
            setTimeout(() => { 
              // Only auto-scroll if this is the first time visiting this channel
              if (!channelsVisited[index]) {
                // Mark this channel as visited
                channelsVisited[index] = true;
                
                // Special case for "säännöt" channel (index 1)
                if (index === 1) {
                  enhancedSmoothScrollTo(messagesContainer, 0);
                } else {
                  // For other channels, scroll to the top of the last message
                  const messages = messagesContainer.querySelectorAll('.message');
                  if (messages.length > 0) {
                    const lastMessage = messages[messages.length - 1];
                    const topPosition = lastMessage.offsetTop - 20;
                    enhancedSmoothScrollTo(messagesContainer, topPosition);
                  } else {
                    enhancedSmoothScrollTo(messagesContainer, messagesContainer.scrollHeight);
                  }
                }
              }
              // If channel was visited before, don't auto-scroll - let it remain at previous position
            }, 10);
          }
        }
      });
      currentIndex = index;
    }
  }
  
  // Channel click handler
  channels.forEach((el) => {
    el.addEventListener('click', () => {
      const newIndex = parseInt(el.dataset.index, 10);
      if (el.classList.contains('redirect-channel')) {
        window.open('https://discord.gg/a4c29YpQ63', '_blank');
      } else if (!isNaN(newIndex)) {
        showChannel(newIndex);
      }
    });
  });
  
    // Wheel event for channel switching
    if (discordClient) {
      // Track if a smooth scroll animation is in progress
      let smoothScrollInProgress = false;
    
      // Enhanced smoothScrollTo function to track animation state
      function enhancedSmoothScrollTo(container, targetPosition) {
        if (!container) return;
        
        smoothScrollInProgress = true;
        
        if ('scrollBehavior' in document.documentElement.style) {
          container.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Set a timeout to clear the flag after animation completes
          // 500ms is an approximate duration for smooth scroll
          setTimeout(() => {
            smoothScrollInProgress = false;
          }, 500);
        } else {
          container.scrollTop = targetPosition;
          smoothScrollInProgress = false;
        }
      }
      
      discordClient.addEventListener('wheel', function(e) {
        if (!discordClient.contains(e.target)) {
          return;
        }
        
        e.preventDefault();
        
        // Block all scrolling if animation is in progress
        if (scrollCooldown || smoothScrollInProgress) return;
        
        // Get the current visible section and its messages container
        const currentSection = sections[currentIndex];
        const messagesContainer = currentSection?.querySelector('.chat-messages');
        
        // Determine scroll direction
        const scrollDirection = Math.sign(e.deltaY); // 1 for down, -1 for up
        
        // Special case for last channel (index 3) when scrolling down
        if (currentIndex === 3 && scrollDirection > 0) {
          // Check if we're at the bottom of content or there is no scrollable content
          const isAtBottom = !messagesContainer || 
            (messagesContainer.scrollHeight <= messagesContainer.clientHeight) ||
            (messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight <= 5);
          
          if (isAtBottom) {
            // For the alert, we don't need buffer zone - show it immediately
            const discordAlert = document.getElementById('discord-alert');
            if (discordAlert && !discordAlert.classList.contains('show')) {
              discordAlert.classList.add('show');
              setTimeout(() => {
                discordAlert.classList.remove('show');
              }, 5000);
            }
            return; // Don't proceed with any more scrolling
          }
        }
        
        if (messagesContainer) {
          // For scrolling down
          if (scrollDirection > 0) {
            // Calculate how close we are to the bottom
            const scrollBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight;
            
            // If not at bottom yet (with some threshold), scroll the messages container instead
            if (scrollBottom > 5) {
              // Use a fixed scroll amount
              const scrollAmount = Math.min(30, scrollBottom);
              messagesContainer.scrollTop += scrollAmount;
              
              // Reset buffer count when scrolling within content
              bufferScrollCount = 0;
              if (bufferResetTimeout) {
                clearTimeout(bufferResetTimeout);
                bufferResetTimeout = null;
              }
              
              return; // Don't switch channels yet
            }
          } 
          // For scrolling up
          else if (scrollDirection < 0) {
            if (messagesContainer.scrollTop > 0) {
              // Use a fixed scroll amount
              const scrollAmount = Math.min(30, messagesContainer.scrollTop);
              messagesContainer.scrollTop -= scrollAmount;
              
              // Reset buffer count when scrolling within content
              bufferScrollCount = 0;
              if (bufferResetTimeout) {
                clearTimeout(bufferResetTimeout);
                bufferResetTimeout = null;
              }
              
              return; // Don't switch channels yet
            }
          }
        }
        
        // Check if we can switch channels
        let canSwitchChannels = false;
        
        // Only allow switching to previous channel if we're not already at the first one
        if (scrollDirection < 0 && currentIndex > 0) {
          canSwitchChannels = true;
        }
        // Only allow switching to next channel if we're not already at the last one
        else if (scrollDirection > 0 && currentIndex < sections.length - 1) {
          canSwitchChannels = true;
        }
        
        // If we can't switch channels, don't proceed
        if (!canSwitchChannels) {
          bufferScrollCount = 0; // Reset buffer
          return;
        }
        
        // If direction changed, reset buffer
        if (lastScrollDirection !== 0 && lastScrollDirection !== scrollDirection) {
          bufferScrollCount = 0;
        }
        
        // Update last direction
        lastScrollDirection = scrollDirection;
        
        // Increment buffer count
        bufferScrollCount++;
        
        // Set timeout to reset buffer if user pauses scrolling
        if (bufferResetTimeout) {
          clearTimeout(bufferResetTimeout);
        }
        bufferResetTimeout = setTimeout(() => {
          bufferScrollCount = 0;
          bufferResetTimeout = null;
        }, 500); // Reset after 500ms of no scrolling
        
        // Check if we've reached the threshold to switch channels
        if (bufferScrollCount < BUFFER_SCROLL_THRESHOLD) {
          return; // Not enough consecutive scrolls yet
        }
        
        // We've reached the threshold, reset buffer
        bufferScrollCount = 0;
        
        // If we've reached the bottom/top and exceeded buffer threshold, proceed with channel switching
        scrollCooldown = true;
        setTimeout(() => scrollCooldown = false, 400);
        
        // Channel switching logic
        let newIndex = currentIndex;
        if (scrollDirection > 0 && currentIndex < sections.length - 1) {
          newIndex = currentIndex + 1;
        } else if (scrollDirection < 0 && currentIndex > 0) {
          newIndex = currentIndex - 1;
        }
        
        const targetChannel = channels.find(ch => parseInt(ch.dataset.index, 10) === newIndex);
        if (targetChannel && !targetChannel.classList.contains('redirect-channel')) {
          showChannel(newIndex);
        } else if (scrollDirection > 0) {
          // Find next available non-redirect channel
          for (let i = currentIndex + 1; i < sections.length; i++) {
            const channel = channels.find(ch => parseInt(ch.dataset.index, 10) === i);
            if (channel && !channel.classList.contains('redirect-channel')) {
              showChannel(i);
              break;
            }
          }
        } else if (scrollDirection < 0) {
          // Find previous available non-redirect channel
          for (let i = currentIndex - 1; i >= 0; i--) {
            const channel = channels.find(ch => parseInt(ch.dataset.index, 10) === i);
            if (channel && !channel.classList.contains('redirect-channel')) {
              showChannel(i);
              break;
            }
          }
        }
      }, { passive: false });

        // Touch support with buffer zone
    let touchStartY = null;
    let touchBufferCount = 0;
    let lastTouchDirection = 0;
    let touchBufferResetTimeout = null;
    
    discordClient.addEventListener('touchstart', function(e) {
      if (discordClient.contains(e.target) && e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      } else {
        touchStartY = null;
      }
    }, { passive: true });
    
    discordClient.addEventListener('touchend', function(e) {
      if (touchStartY === null || !discordClient.contains(e.target) || scrollCooldown || smoothScrollInProgress) return;
      
      let touchEndY = e.changedTouches[0].clientY;
      let diff = touchStartY - touchEndY;
      let touchDirection = Math.sign(diff); // 1 for swipe up (scroll down), -1 for swipe down (scroll up)
      
      // Check if we can switch channels
      let canSwitchChannels = false;
      
      // Only allow switching to previous channel if we're not already at the first one
      if (touchDirection < 0 && currentIndex > 0) {
        canSwitchChannels = true;
      }
      // Only allow switching to next channel if we're not already at the last one
      else if (touchDirection > 0 && currentIndex < sections.length - 1) {
        canSwitchChannels = true;
      }
      
      // If we can't switch channels, reset buffer and return
      if (!canSwitchChannels || Math.abs(diff) < 30) {
        touchBufferCount = 0;
        return;
      }
      
      // If direction changed, reset buffer
      if (lastTouchDirection !== 0 && lastTouchDirection !== touchDirection) {
        touchBufferCount = 0;
      }
      
      // Update last direction
      lastTouchDirection = touchDirection;
      
      // Increment buffer count
      touchBufferCount++;
      
      // Set timeout to reset buffer
      if (touchBufferResetTimeout) {
        clearTimeout(touchBufferResetTimeout);
      }
      touchBufferResetTimeout = setTimeout(() => {
        touchBufferCount = 0;
        touchBufferResetTimeout = null;
      }, 1000); // Longer timeout for touch
      
      // For touch, we use a smaller threshold since touch swipes are more deliberate
      if (touchBufferCount < 2) {
        return; // Not enough consecutive swipes yet
      }
      
      // Reset buffer
      touchBufferCount = 0;
      
      // Proceed with channel switching
      scrollCooldown = true;
      setTimeout(() => scrollCooldown = false, 700);
      
      let newIndex = currentIndex;
      if (touchDirection > 0 && currentIndex < sections.length - 1) {
        newIndex = currentIndex + 1;
      } else if (touchDirection < 0 && currentIndex > 0) {
        newIndex = currentIndex - 1;
      }
      
      const targetChannel = channels.find(ch => parseInt(ch.dataset.index, 10) === newIndex);
      if (targetChannel && !targetChannel.classList.contains('redirect-channel')) {
        showChannel(newIndex);
      } else if (touchDirection > 0) {
        // Find next available non-redirect channel
        for (let i = currentIndex + 1; i < sections.length; i++) {
          const channel = channels.find(ch => parseInt(ch.dataset.index, 10) === i);
          if (channel && !channel.classList.contains('redirect-channel')) {
            showChannel(i);
            break;
          }
        }
      } else if (touchDirection < 0) {
        // Find previous available non-redirect channel
        for (let i = currentIndex - 1; i >= 0; i--) {
          const channel = channels.find(ch => parseInt(ch.dataset.index, 10) === i);
          if (channel && !channel.classList.contains('redirect-channel')) {
            showChannel(i);
            break;
          }
        }
      }
      
      touchStartY = null;
    });
  }
}