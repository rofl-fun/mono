from enum import Enum

# General result class, can be applicable to both success or error
class Result:
    # Initialization
    def __init__(self, message: str, value=None):
        self.message = message
        self.value = value

    # Helperfunc to log 
    def log(self) -> None:
        print(f"{self.__class__.__name__}: {self.message}")
        if self.value is not None:
            print(f"Value: {self.value}")

# Polymorphic class for success
class Success(Result):
    pass

# Polymorphic class for error
class Error(Result, Exception):
    pass

# Enum class, root for the status, that keeps track of error or success
class RoflStatus(Enum):
    SUCCESS = Success
    ERROR = Error

    # Create a status
    def create(self, message: str, value=None):
        return self.value(message, value)
